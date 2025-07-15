// frontend/api/generate.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',  // Use GPT-4 for better output
      messages: [
        {
          role: 'system',
          content: `You are a software architect that converts English descriptions of systems into beautiful, detailed Mermaid diagram code.
- Use appropriate flowchart symbols (e.g., decision boxes, rounded rectangles).
- Add styling like colors or subgraphs where applicable.
- Output only valid Mermaid syntax suitable for flowcharts or graph TD.
- Avoid any explanation or extra text, only Mermaid code.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const diagram = response.choices[0].message.content.trim();
    res.status(200).json({ diagram });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate diagram' });
  }
}
