import React, { useState, useRef, useEffect } from "react";
import MermaidChart from "./MermaidChart";
import domtoimage from "dom-to-image-more";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Analytics } from '@vercel/analytics/react';




export default function App() {
  const stripePromise = loadStripe("pk_live_51RYfzEE4aTYVTdscflWE2yAKme49kOayDvWKvPymQgh1rAXl9MaBPYAdNCS1wm1ZS4R3c0t53iVAjIiLoalq8txn00JZNP820s"); // Test key from Stripe Dashboard
  const [inputText, setInputText] = useState("");
  const [diagramCode, setDiagramCode] = useState("");
  const [template, setTemplate] = useState("");
  const chartRef = useRef();

  const templates = {
    simple: `Start to Step 1
Step 1 to Step 2 and Step 3
Step 2 to End
Step 3 to End`,

    sequential: `Start to Call API with Security Group
Call API with Security Group to Get users and owners of the Security Group
Get users and owners of the Security Group to Upload users and owners to PDF
Upload users and owners to PDF to Get AWS account linked to the Security Group
Get AWS account linked to the Security Group to Get IAM Role (Owner, App Admin, or DB Admin)
Get IAM Role (Owner, App Admin, or DB Admin) to Get custom managed IAM policies of the role
Get custom managed IAM policies of the role to Upload IAM policies to PDF
Upload IAM policies to PDF to Generate report
Generate report to Done`,

    complex: `Start to Load Configuration
Load Configuration to Connect to IoT Broker and Authenticate
Connect to IoT Broker and Authenticate to Subscribe to Sensors and Devices
Subscribe to Sensors and Devices to Collect Data
Collect Data to Process Data
Process Data to Analyze Data and Generate Alerts
Analyze Data and Generate Alerts to Send Notifications and Store in DB
Send Notifications and Store in DB to Visualize Data and Reports
Visualize Data and Reports to End Process`,

    iot: `IoT Gateway to Sensor 1 and Sensor 2 and Sensor 3
Sensor 1 to Data Collector
Sensor 2 to Data Collector
Sensor 3 to Data Collector
Data Collector to Cloud Storage
Cloud Storage to Data Processing
Data Processing to Dashboard`,

    flowchart: `Start to Input Data
Input Data to Validate Data
Validate Data to Process Data and Show Error
Process Data to Save Data
Save Data to End`
  };

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

    if (edges.length === 0) return "";

    return `graph TD\n` + edges.join("\n");
  };

  const sanitizeNode = (node) =>
    node.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

  const handleGenerate = () => {
    const mermaidCode = convertToMermaid(inputText);
    if (!mermaidCode) {
      alert("Invalid input! Please follow the 'A to B and C' pattern.");
    }
    setDiagramCode(mermaidCode);
  };

  const handleTemplateChange = (e) => {
    const key = e.target.value;
    setTemplate(key);
    setInputText(templates[key] || "");
    setDiagramCode("");
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
    setTemplate(""); // clear template on import
  };

  const handleShareLink = () => {
    const encoded = encodeURIComponent(inputText);
    const url = `${window.location.origin}?data=${encoded}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard! You can share it.");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      setInputText(decodeURIComponent(data));
    }
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1581090700227-1e8eaffee3d4?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        padding: 20,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
        <header style={{ marginBottom: 16 }}>
 <h1
  style={{
    fontSize: 36,
    fontWeight: 700,
    margin: 0,
    color: "#2f5252"
  }}
>
  🧠 AI Diagram Generator
</h1>
<p
  style={{
    fontSize: 16,
    fontWeight: 400,
    marginTop: 6,
    color: "#444"
  }}
>
  Instantly turn simple English descriptions into professional Mermaid diagrams.
</p>

</header>



      <main
        style={{
          flex: 1,
          display: "flex",
          gap: 24,
          minHeight: 0, // important for flex children scroll to work
        }}
      >
        {/* Left panel: input & controls */}
        <section
          style={{
            width: 360,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            borderRadius: 16,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            overflowY: "auto",
            scrollbarWidth: "thin",
          }}
        >
          <select
            onChange={handleTemplateChange}
            value={template}
            style={{
              padding: 12,
              fontSize: 16,
              borderRadius: 8,
              border: "1px solid #ccc",
              marginBottom: 20,
              backgroundColor: "#fff",
              color: "#333",
              cursor: "pointer",
            }}
            aria-label="Select diagram template"
          >
            <option value="">-- Select a template --</option>
            <option value="simple">Simple</option>
            <option value="sequential">Sequential</option>
            <option value="complex">Complex</option>
            <option value="iot">IoT</option>
            <option value="flowchart">Flowchart</option>
          </select>

          <textarea
            rows={20}
            style={{
              flexGrow: 1,
              fontSize: 16,
              fontFamily: "monospace",
              borderRadius: 10,
              border: "1px solid #ccc",
              padding: 14,
              resize: "vertical",
              backgroundColor: "#fefefe",
              color: "#333",
              minHeight: 200,
              maxHeight: "60vh",
            }}
            placeholder="Describe your flow..."
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setDiagramCode("");
              setTemplate("");
            }}
            aria-label="Diagram description input"
          />

          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <button onClick={handleGenerate} className="btn primary">
              Generate
            </button>
            {diagramCode && (
              <>
                <button onClick={handleSaveImage} className="btn success">
                  Save Image
                </button>
                <button onClick={handleShareLink} className="btn info">
                  Share
                </button>
              </>
            )}
            <button onClick={handleExport} className="btn dark">
              Export
            </button>
            <label className="btn dark" style={{ cursor: "pointer" }}>
              Import
              <input
                type="file"
                accept=".txt"
                onChange={handleImport}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </section>

        {/* Right panel: diagram */}
        <section
          ref={chartRef}
          style={{
            flex: 1,
            marginRight: 380,
            background: "#fff",
            borderRadius: 16,
            padding: 30,
            boxShadow: "0 0 40px rgba(0, 0, 0, 0.5)",
            color: "#111",
            overflow: "auto",
            minHeight: 0, // important for flex children scroll to work
          }}
          aria-live="polite"
          aria-label="Generated diagram"
        >
          {diagramCode ? (
            <MermaidChart
              chart={diagramCode}
              scale={template === "complex" ? 2.5 : 1.2}
            />
          ) : (
            <p style={{ color: "#777" }}>
              Diagram will appear here after generating.
            </p>
          )}
        </section>
      </main>
<div
  style={{
    alignSelf: "flex-start",
    marginTop: 20,
    marginRight: 20,
    position: "absolute",
    top: 20,
    right: 20,
    width: 340
  }}
>
  <Elements stripe={stripePromise}>
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 0 20px rgba(0,0,0,0.2)"
      }}
    >
      <h2 style={{ color: "#111", marginBottom: 10, fontSize: 18 }}>
        Support this Project
      </h2>
      <p style={{ color: "#333", marginBottom: 10, fontSize: 14 }}>
        Want to support further development? Donate below.
      </p>
      <CheckoutForm />
    </div>
  </Elements>
</div>



      <style>{`
        .btn {
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: white;
          user-select: none;
        }
        .primary { background-color: #007bff; }
        .success { background-color: #28a745; }
        .info { background-color: #17a2b8; }
        .dark { background-color: #343a40; }

        .btn:hover {
          opacity: 0.9;
        }

        /* scrollbar styling for left panel */
        section::-webkit-scrollbar {
          width: 8px;
        }
        section::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.3);
          border-radius: 4px;
        }

        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
      `}</style>
      <Analytics />
    </div>
  );
}
