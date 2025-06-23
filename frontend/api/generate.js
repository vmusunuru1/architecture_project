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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a software architect that converts English descriptions of systems into Mermaid diagram code. Only return Mermaid code.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const diagram = response.choices[0].message.content;
    res.status(200).json({ diagram });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate diagram' });
  }
}

