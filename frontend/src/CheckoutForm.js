import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

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
      body: JSON.stringify({ amount: cents, email }),
    });

    const { clientSecret } = await res.json();

    const card = elements.getElement(CardNumberElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          email: email || undefined,
          address: {
            line1: addressLine1 || undefined,
            line2: addressLine2 || undefined,
            city: city || undefined,
            state: state || undefined,
            postal_code: postalCode || undefined,
            country: country || undefined,
          },
        },
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Payment successful!");
      setAmount("");
      setEmail("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "15px",
    marginBottom: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
    color: "#333",
  };

  const sectionStyle = {
    marginBottom: "20px",
  };

  const elementStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "16px",
  };

  const stripeInputOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": { color: "#aab7c4" },
      },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "420px",
        background: "#f9f9f9",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Support this Project</h2>

      <div style={sectionStyle}>
        <label style={labelStyle}>Amount (USD)</label>
        <input
          type="number"
          step="0.01"
          placeholder="e.g. 10.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Email (optional)</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Billing Address (optional)</label>
        <input
          type="text"
          placeholder="Address Line 1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Address Line 2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Card Number</label>
        <div style={elementStyle}>
          <CardNumberElement options={stripeInputOptions} />
        </div>

        <label style={labelStyle}>Expiration Date</label>
        <div style={elementStyle}>
          <CardExpiryElement options={stripeInputOptions} />
        </div>

        <label style={labelStyle}>CVC</label>
        <div style={elementStyle}>
          <CardCvcElement options={stripeInputOptions} />
        </div>
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: "#0070f3",
          color: "#fff",
          padding: "12px",
          fontSize: "16px",
          border: "none",
          borderRadius: "6px",
          width: "100%",
          cursor: "pointer",
        }}
      >
        Pay ${amount || "0.00"}
      </button>
    </form>
  );
}
