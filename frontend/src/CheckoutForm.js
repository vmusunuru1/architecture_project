import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid dollar amount.");
      return;
    }

    const cents = Math.round(parseFloat(amount) * 100);

    const res = await fetch("http://localhost:5000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: cents }),
    });

    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Payment successful!");
      setAmount("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <label style={{ marginBottom: 6, display: "block", color: "#111" }}>
        Enter Amount (USD)
      </label>
      <input
        type="number"
        step="0.01"
        placeholder="e.g. 5.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": { color: "#aab7c4" },
            },
          },
        }}
      />

      <button
        type="submit"
        className="btn primary"
        style={{ marginTop: 20, width: "100%" }}
      >
        Pay ${amount || "0.00"}
      </button>
    </form>
  );
}

