import React, { useState, useRef } from "react";
import MermaidChart from "./MermaidChart";
import domtoimage from "dom-to-image-more";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [diagramCode, setDiagramCode] = useState("");
  const [template, setTemplate] = useState("");
  const chartRef = useRef();

  const convertToMermaid = (text) => {
    if (!text) return "";

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

    return `graph TD\n` + edges.join("\n");
  };

  const sanitizeNode = (node) =>
    node.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

  const handleGenerate = () => {
    const mermaidCode = convertToMermaid(inputText);
    setDiagramCode(mermaidCode);
  };

  const applyTemplate = (type) => {
    const templates = {
      microservices: "Client to API Gateway and Auth Service\nAPI Gateway to User Service and Product Service",
      etl: "Source to Extractor\nExtractor to Transformer\nTransformer to Loader\nLoader to Data Warehouse",
      cicd: "Developer to GitHub\nGitHub to Jenkins\nJenkins to Docker and Kubernetes",
      loginFlow: "User to Login Page\nLogin Page to Auth Service\nAuth Service to Dashboard",
      dataflow: "Sensor to Microcontroller\nMicrocontroller to Cloud Gateway\nCloud Gateway to Analytics Engine",
      sequential: "Step 1 to Step 2\nStep 2 to Step 3\nStep 3 to Done"
    };
    setInputText(templates[type]);
    setTemplate(type);
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

  const handleExport = () => {
    const blob = new Blob([inputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagram.txt";
    link.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setInputText(e.target.result);
    reader.readAsText(file);
  };

  const handleShareLink = () => {
    const encoded = encodeURIComponent(inputText);
    const url = `${window.location.origin}?data=${encoded}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard! You can share it.");
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      setInputText(decodeURIComponent(data));
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('https://www.transparenttextures.com/patterns/connected.png')",
        backgroundSize: "cover",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          background: "#fff",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)"
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 10 }}>🛠️ AI-Powered Diagram Generator</h1>
        <p style={{ color: "#555", marginBottom: 25 }}>
          Describe your architecture, process, or data flow using plain English. This tool will instantly generate a Mermaid diagram for you. No drawing required.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 500, marginRight: 10 }}>Choose a Template:</label>
          <select
            value={template}
            onChange={(e) => applyTemplate(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 16 }}
          >
            <option value="">-- Select Template --</option>
            <option value="microservices">Microservices Architecture</option>
            <option value="etl">ETL Pipeline</option>
            <option value="cicd">CI/CD Process</option>
            <option value="loginFlow">Login Flow</option>
            <option value="dataflow">IoT Dataflow</option>
            <option value="sequential">Sequential Steps</option>
          </select>
        </div>

        <textarea
          rows={5}
          style={{
            width: "100%",
            padding: 14,
            fontSize: 16,
            border: "1px solid #ccc",
            borderRadius: 8,
            resize: "vertical",
            fontFamily: "monospace",
            background: "#fdfdfd",
            color: "#000"
          }}
          placeholder="Enter your architecture or flow here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button
            onClick={handleGenerate}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: 16,
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Generate Diagram
          </button>

          {diagramCode && (
            <>
              <button
                onClick={handleSaveImage}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  fontSize: 16,
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                Save as Image
              </button>
              <button
                onClick={handleShareLink}
                style={{
                  background: "#17a2b8",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  fontSize: 16,
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                Share Link
              </button>
            </>
          )}

          <button
            onClick={handleExport}
            style={{
              background: "#6f42c1",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: 16,
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Export
          </button>

          <label style={{ display: "inline-block", cursor: "pointer", color: "#fff", background: "#343a40", padding: "10px 20px", borderRadius: 6 }}>
            Import
            <input type="file" accept=".txt" onChange={handleImport} style={{ display: "none" }} />
          </label>
        </div>

        <div style={{ marginTop: 30 }} ref={chartRef}>
          {diagramCode ? (
            <MermaidChart chart={diagramCode} />
          ) : (
            <p style={{ color: "#999" }}>
              Your diagram will appear here once generated.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

