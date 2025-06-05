import React, { useState } from "react";
import MermaidChart from "./MermaidChart";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [diagramCode, setDiagramCode] = useState("");

  const convertToMermaid = (text) => {
  if (!text) return "";

  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const edges = [];

  for (const line of lines) {
    const [fromPart, toPart] = line.split("to").map(s => s.trim());

    if (!fromPart || !toPart) continue;

    const from = sanitizeNode(fromPart);

    // Support branching with "and"
    const toNodes = toPart
      .split("and")
      .map(t => sanitizeNode(t.trim()))
      .filter(Boolean);

    for (const to of toNodes) {
      edges.push(`${from} --> ${to}`);
    }
  }

  return `graph TD\n` + edges.join("\n");
};

const sanitizeNode = (node) => {
  // Remove quotes and spaces, keep readable names
  return node.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, '');
};




  const handleGenerate = () => {
    console.log("Input text:", inputText);
    const mermaidCode = convertToMermaid(inputText);
    console.log("Generated Mermaid code:", mermaidCode);
    setDiagramCode(mermaidCode);
  };

  return (
    <div style={{ padding: 20 }}>
      <textarea
        rows={4}
        cols={50}
        placeholder="Enter description, e.g. 'Frontend to Backend'"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <br />
      <button onClick={handleGenerate} style={{ marginTop: 10 }}>
        Generate Diagram
      </button>

      <div style={{ marginTop: 20 }}>
        {diagramCode ? (
          <MermaidChart chart={diagramCode} />
        ) : (
          <p>Diagram preview will appear here.</p>
        )}
      </div>
    </div>
  );
}

