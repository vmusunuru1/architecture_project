import React from "react";
import { Link } from "react-router-dom";


export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px", lineHeight: 1.6 }}>
      <h1>Privacy Policy</h1>
      <p style={{ marginTop: "30px" }}>
        <Link to="/" style={{ color: "#007bff", textDecoration: "underline" }}>
          ← Back to Home
        </Link>
      </p>
      <p>Last updated: June 2025</p>
      <p>
        Mermaid Diagram Generator ("we," "our," or "us") respects your privacy and is committed to protecting it through this Privacy Policy.
      </p>

      <h2>Information We Collect</h2>
      <p>We may collect certain information automatically such as your IP address, browser type, and device info to improve user experience.</p>

      <h2>Google AdSense</h2>
      <p>
        We use Google AdSense. Google may collect info to serve personalized ads. See{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google's Privacy Policy
        </a>.
      </p>

      <h2>Cookies</h2>
      <p>
        AdSense uses cookies for personalized ads. You can manage your settings at{" "}
        <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
          Google Ad Settings
        </a>.
      </p>

      <h2>Your Choices</h2>
      <p>You may disable cookies in your browser, though it may affect functionality.</p>

      <h2>Contact</h2>
      <p>Questions? Email us at <a href="mailto:support@merm.cloud">support@merm.cloud</a>.</p>
    </div>
  );
}
