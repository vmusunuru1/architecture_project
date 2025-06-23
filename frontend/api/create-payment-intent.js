// frontend/api/create-payment-intent.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, email, address } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const params = {
      amount,
      currency: 'usd',
      metadata: {
        ...(email ? { email } : {}),
        ...(address ? { address } : {}),
      },
    };

    if (email) {
      params.receipt_email = email;
    }

    const paymentIntent = await stripe.paymentIntents.create(params);

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

