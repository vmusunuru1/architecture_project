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
    backgroundColor: "#f4f6f8",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  }}
>
<nav
  style={{
    width: "100%",
    backgroundColor: "#000",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  }}
>
  <div
    style={{
      maxWidth: 1100,
      margin: "0 auto",
      padding: "10px 16px",
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <div style={{ fontWeight: 800 }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
        merm.cloud
      </Link>
    </div>

    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      <Link to="/tutorial" style={{ color: "#fff", textDecoration: "none" }}>Tutorial</Link>
      <Link to="/examples" style={{ color: "#fff", textDecoration: "none" }}>Examples</Link>
      <Link to="/faq" style={{ color: "#fff", textDecoration: "none" }}>FAQ</Link>
      <Link to="/about" style={{ color: "#fff", textDecoration: "none" }}>About</Link>
      <Link to="/contact" style={{ color: "#fff", textDecoration: "none" }}>Contact</Link>
    </div>
  </div>
</nav>
    <div
  style={{
    margin: "40px auto",
    padding: "40px 50px",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    textAlign: "center",
    maxWidth: 800,
    alignSelf: "center",
    color: "#2f5252",
  }}
>
        <h1 style={{ fontSize: 28, margin: 0 }}>🧠 AI Diagram Generator</h1>
        <div
  style={{
    maxWidth: 960,
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    color: "#333",
    lineHeight: 1.7
  }}
>
  <h2>What Is Mermaid Diagram Generator?</h2>

  <p>
    Mermaid Diagram Generator is a web-based tool that converts plain English descriptions
    into structured diagrams using Mermaid.js syntax. Instead of manually drawing boxes,
    arrows, and connections in traditional diagram tools, you simply describe your workflow
    in text, and the diagram is generated instantly in your browser.
  </p>

  <p>
    Mermaid is a popular text-based diagramming language used by developers,
    architects, students, and technical writers. Because diagrams are written in
    plain text, they can be version-controlled in Git repositories, reviewed in
    pull requests, and maintained alongside documentation.
  </p>

  <h2>Why Use Mermaid Instead of Traditional Diagram Tools?</h2>

  <p>
    Traditional diagram tools require manual drawing and formatting, which can
    become time-consuming and inconsistent. Mermaid diagrams are different —
    they are defined entirely through structured text.
  </p>

  <ul>
    <li>✔ Faster diagram creation</li>
    <li>✔ Easy editing and updates</li>
    <li>✔ Works in documentation platforms</li>
    <li>✔ Compatible with Git and version control</li>
    <li>✔ Lightweight and developer-friendly</li>
  </ul>

  <h2>How This Tool Works</h2>

  <p>
    Simply type a structured description such as:
  </p>

  <pre style={{ background: "#f4f6f8", padding: 12, borderRadius: 8 }}>
{`User to WebApp
WebApp to API and Database`}
  </pre>

  <p>
    Click <strong>Generate</strong>, and the system automatically converts it
    into Mermaid.js flowchart syntax and renders a clean diagram.
  </p>

  <p>
    Everything runs directly in your browser — no installation, no login,
    and no data storage required.
  </p>

  <h2>Who Is This Tool For?</h2>

  <p>
    This diagram generator is useful for:
  </p>

  <ul>
    <li>Software engineers documenting system architecture</li>
    <li>Students learning system design and workflows</li>
    <li>Product managers explaining processes</li>
    <li>DevOps engineers mapping infrastructure</li>
    <li>Technical writers creating documentation diagrams</li>
  </ul>

  <h2>Types of Diagrams You Can Create</h2>

  <p>
    Mermaid supports many diagram types. With this tool, you can create:
  </p>

  <ul>
    <li>Flowcharts</li>
    <li>Sequence diagrams</li>
    <li>State diagrams</li>
    <li>Entity relationship diagrams</li>
    <li>Class diagrams</li>
  </ul>

  <h2>Learn More</h2>

  <p>
    If you're new to Mermaid syntax, check out our{" "}
    <a href="/tutorial">Mermaid Tutorial</a> to learn how to write diagrams
    effectively.
  </p>

  <p>
    You can also explore ready-made templates in our{" "}
    <a href="/examples">Examples page</a> or browse common questions in the{" "}
    <a href="/faq">FAQ section</a>.
  </p>

  <h2>Why We Built This Tool</h2>

  <p>
    Many developers prefer documentation that is simple, portable, and easy to
    maintain. By combining natural language input with Mermaid.js rendering,
    this generator makes it easier to translate ideas into diagrams quickly.
  </p>

  <p>
    Whether you're sketching a quick workflow or documenting a full system,
    this tool helps you focus on structure rather than formatting.
  </p>
</div>

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
