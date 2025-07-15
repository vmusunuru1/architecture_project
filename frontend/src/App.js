import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import MermaidChart from "./MermaidChart";
import domtoimage from "dom-to-image-more";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Analytics } from "@vercel/analytics/react";
import { fetchTemplates, addTemplate } from "./firestoreTemplates";

export default function App() {
  const stripePromise = loadStripe(
    "pk_live_51RYfzEE4aTYVTdscflWE2yAKme49kOayDvWKvPymQgh1rAXl9MaBPYAdNCS1wm1ZS4R3c0t53iVAjIiLoalq8txn00JZNP820s"
  );

  const location = useLocation();
  const chartRef = useRef();
  const topAdsRef = useRef(null);
  const sidebarAdsRef = useRef(null);

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [inputText, setInputText] = useState("");
  const [diagramCode, setDiagramCode] = useState("");

  useEffect(() => {
    async function loadTemplates() {
      const loaded = await fetchTemplates();
      setTemplates(loaded);
    }
    loadTemplates();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dataParam = params.get("data");
    if (dataParam && !selectedTemplate) {
      try {
        const decoded = decodeURIComponent(dataParam);
        setInputText(decoded);
        setDiagramCode("");
      } catch (error) {
        console.error("Failed to decode data param:", error);
      }
    }
  }, [location.search, selectedTemplate]);

  useEffect(() => {
    if (!selectedTemplate) return;
    const t = templates.find((t) => t.id === selectedTemplate);
    if (t) {
      setInputText(t.content);
      setDiagramCode("");
    }
  }, [selectedTemplate, templates]);

  useEffect(() => {
    if (window.adsbygoogle) {
      try {
        if (topAdsRef.current) window.adsbygoogle.push({});
        if (sidebarAdsRef.current) window.adsbygoogle.push({});
      } catch (e) {
        console.error("AdsbyGoogle error:", e);
      }
    }
  }, []);

  const sanitizeNode = (node) =>
    node.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

  const convertToMermaid = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const edges = [];
    for (const line of lines) {
      const [fromPart, toPart] = line.split("to").map((s) => s.trim());
      if (!fromPart || !toPart) continue;
      const from = sanitizeNode(fromPart);
      const toNodes = toPart
        .split("and")
        .map((t) => sanitizeNode(t.trim()))
        .filter(Boolean);
      for (const to of toNodes) {
        edges.push(`${from} --> ${to}`);
      }
    }
    return edges.length > 0 ? `graph TD\n${edges.join("\n")}` : "";
  };

  const handleGenerate = () => {
    const mermaidCode = convertToMermaid(inputText);
    if (!mermaidCode) {
      alert("Invalid input! Please follow the 'A to B and C' pattern.");
      return;
    }
    setDiagramCode(mermaidCode);
  };

  const handleAddTemplate = async () => {
    if (!inputText.trim()) {
      alert("Enter content before saving.");
      return;
    }
    const name = prompt("Template name:");
    if (!name) return;

    try {
      const newId = await addTemplate(name, inputText);
      const updated = await fetchTemplates();
      setTemplates(updated);
      setSelectedTemplate(newId);
      alert("Template saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to add template");
    }
  };

  const handleSaveImage = () => {
    if (!chartRef.current) return;
    domtoimage.toPng(chartRef.current).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "diagram.png";
      link.href = dataUrl;
      link.click();
    });
  };

  // Detect if on homepage (path = "/")
  const isHomePage = location.pathname === "/";

  return (
    <div
  style={{
    minHeight: "100vh",
    width: "100vw", // Ensure it spans full viewport width
    overflowX: "hidden", // Prevent horizontal scroll
    backgroundColor: "#1a1a1a",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  }}
>
      <div
        style={{
          marginTop: 24,
          marginBottom: 24,
          padding: 24,
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: 12,
          textAlign: "center",
          maxWidth: 960,
          alignSelf: "center",
          color: "#2f5252",
        }}
      >
        <h1 style={{ fontSize: 32, margin: 0 }}>🧠 AI Diagram Generator</h1>

        {/* Top Banner Ad */}
        <div style={{ marginTop: 16 }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-4713365631308072"
            data-ad-slot="2452757533"
            data-ad-format="auto"
            data-full-width-responsive="true"
            ref={topAdsRef}
          ></ins>
        </div>

        <p style={{ marginTop: 8, fontSize: 16, fontWeight: 500 }}>
          Welcome to Mermaid Diagram Generator – convert descriptions into diagrams instantly.
        </p>
      </div>

      <main style={{ flex: 1, display: "flex", gap: 24 }}>
        <section
          style={{
            width: 360,
            backgroundColor: "rgba(0,0,0,0.75)",
            borderRadius: 16,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
              backgroundColor: "#fff",
              color: "#333",
            }}
          >
            <option value="">-- Select template --</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <textarea
            rows={20}
            placeholder="Describe your flow..."
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setDiagramCode("");
              setSelectedTemplate("");
            }}
            style={{
              flexGrow: 1,
              borderRadius: 8,
              fontSize: 15,
              padding: 12,
              fontFamily: "monospace",
              backgroundColor: "#fefefe",
              color: "#333",
              border: "1px solid #ccc",
            }}
          />

          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={handleGenerate} className="btn primary">
              Generate
            </button>
            {diagramCode && (
              <button onClick={handleSaveImage} className="btn success">
                Save Image
              </button>
            )}
            <button onClick={handleAddTemplate} className="btn info">
              Add Template
            </button>
          </div>

          <div style={{ marginTop: 30 }}>
            <h3 style={{ color: "#fff", marginBottom: 10 }}>
              ❤️ Want to support further development? Please Donate below.
            </h3>
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>

          {/* Sidebar AdSense Banner Ad */}
          <div style={{ marginTop: 30 }}>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-4713365631308072"
              data-ad-slot="2452757533"
              data-ad-format="auto"
              data-full-width-responsive="true"
              ref={sidebarAdsRef}
            ></ins>
          </div>
        </section>

        <section
          ref={chartRef}
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 16,
            padding: 30,
            color: "#111",
            overflow: "auto",
          }}
        >
          {diagramCode ? (
            <MermaidChart chart={diagramCode} scale={1.2} />
          ) : (
            <p style={{ color: "#777" }}>Diagram will appear here after generating.</p>
          )}
        </section>
      </main>

      <style>{`
        .btn {
          padding: 10px 16px;
          font-size: 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: white;
        }
        .primary { background-color: #007bff; }
        .success { background-color: #28a745; }
        .info { background-color: #17a2b8; }
        .btn:hover { opacity: 0.9; }
      `}</style>

      <Analytics />

      {/* Sticky footer at bottom */}
      {/* Sticky Black Footer */}
      <div
        style={{
          backgroundColor: "#000",
          color: "#fff",
          width: "100%",
          textAlign: "center",
          padding: "16px 0",
          marginTop: "auto",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>
          <Link
            to="/privacy"
            style={{ color: "#fff", textDecoration: "none", margin: "0 8px" }}
          >
            Privacy Policy
          </Link>
          |
          <Link
            to="/terms"
            style={{ color: "#fff", textDecoration: "none", margin: "0 8px" }}
          >
            Terms of Use
          </Link>
          |
          <Link
            to="/contact"
            style={{ color: "#fff", textDecoration: "none", margin: "0 8px" }}
          >
            Contact
          </Link>
          <br />
          © 2025 Mermaid Diagram Generator. All rights reserved.
        </p>
      </div>
    </div>
  );
}
