const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ NEW OpenAI INIT (v4+)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate', async (req, res) => {
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
    res.json({ diagram });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate diagram' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
