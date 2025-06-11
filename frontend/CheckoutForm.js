import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) return;

  // Step 1: call your backend to create a PaymentIntent
  const res = await fetch("http://localhost:4242/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 999 }), // Amount in cents
  });

  const { clientSecret } = await res.json();

  // Step 2: confirm the payment with Stripe.js
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement),
    },
  });

  if (result.error) {
    alert(result.error.message);
  } else {
    if (result.paymentIntent.status === "succeeded") {
      alert("🎉 Payment succeeded!");
    }
  }
};
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
          },
        }}
      />
      <button type="submit" className="btn primary" style={{ marginTop: 20 }}>
        Pay
      </button>
    </form>
  );
}

