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
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, email, address } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const params = {
      amount,
      currency: "usd",
      metadata: {
        ...(email ? { email } : {}),
        ...(address ? { address } : {}),
      },
    };

    if (email) {
      params.receipt_email = email;
    }

    const paymentIntent = await stripe.paymentIntents.create(params);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Payment Intent Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
// === Health check route ===
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
