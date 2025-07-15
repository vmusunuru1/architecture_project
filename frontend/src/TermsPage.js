import React from "react";
import { Link } from "react-router-dom";


export default function TermsPage() {
  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px", lineHeight: 1.6 }}>
      <h1>Terms of Service</h1>
      <p>Last updated: June 2025</p>

      <p>By using Mermaid Diagram Generator, you agree to the following terms:</p>

      <ul>
        <li>You will use the tool only for lawful purposes.</li>
        <li>We are not liable for any misuse or data loss.</li>
        <li>We may update these terms without prior notice.</li>
      </ul>

      <p>Use of the site constitutes acceptance of these terms.</p>
      <p style={{ marginTop: "30px" }}>
        <Link to="/" style={{ color: "#007bff", textDecoration: "underline" }}>
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}
