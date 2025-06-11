const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');
const Stripe = require('stripe');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Stripe setup
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Add this to .env

// === OpenAI Route ===
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

// === Stripe Payment Route ===
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., 500 = $5.00)
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Payment Intent creation failed' });
  }
});
// === Health check route ===
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
