import React from "react";
import { Link } from "react-router-dom";


export default function ContactPage() {
  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px", lineHeight: 1.6 }}>
      <h1>Contact Us</h1>
      <p>If you have questions, suggestions, or bug reports, please email us at:</p>
      <p>
        <a href="mailto:support@merm.cloud">support@merm.cloud</a>
      </p>
      <p style={{ marginTop: "30px" }}>
        <Link to="/" style={{ color: "#007bff", textDecoration: "underline" }}>
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}
