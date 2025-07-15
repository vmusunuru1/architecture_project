import React, { useState } from "react";

export default function Analyzer() {
  const [inputText, setInputText] = useState("");
  const [report, setReport] = useState(null);

  // Parse input text to get nodes and edges
  function analyzeText(text) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const edges = [];
    const nodesSet = new Set();

    // Extract nodes and edges from lines like "A to B and C"
    lines.forEach((line) => {
      if (!line.includes("to")) return; // skip invalid lines

      const [fromPart, toPart] = line.split("to").map((s) => s.trim());
      if (!fromPart || !toPart) return;

      nodesSet.add(fromPart);

      const toNodes = toPart.split("and").map((n) => n.trim());
      toNodes.forEach((to) => {
        nodesSet.add(to);
        edges.push({ from: fromPart, to });
      });
    });

    const nodes = Array.from(nodesSet);

    // Find nodes with no incoming edges (start nodes)
    const nodesWithIncoming = new Set(edges.map((e) => e.to));
    const isolatedNodes = nodes.filter(
      (n) =>
        !edges.some((e) => e.from === n || e.to === n) // no in or out edges
    );
    const noIncoming = nodes.filter((n) => !nodesWithIncoming.has(n));

    // Simple cycle detection with DFS
    const graph = {};
    nodes.forEach((n) => (graph[n] = []));
    edges.forEach(({ from, to }) => {
      graph[from].push(to);
    });

    const visited = new Set();
    const recStack = new Set();
    let hasCycle = false;

    function dfs(node) {
      if (hasCycle) return;
      if (!visited.has(node)) {
        visited.add(node);
        recStack.add(node);
        for (const neighbor of graph[node]) {
          if (!visited.has(neighbor)) {
            dfs(neighbor);
          } else if (recStack.has(neighbor)) {
            hasCycle = true;
            return;
          }
        }
      }
      recStack.delete(node);
    }

    nodes.forEach(dfs);

    return {
      nodesCount: nodes.length,
      edgesCount: edges.length,
      isolatedNodes,
      startNodes: noIncoming,
      hasCycle,
    };
  }

  const handleAnalyze = () => {
    const result = analyzeText(inputText);
    setReport(result);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Diagram Analyzer</h2>
      <textarea
        rows={10}
        style={{ width: "100%", fontFamily: "monospace", fontSize: 16 }}
        placeholder="Paste your cleaned diagram text here (e.g. 'A to B and C')"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button onClick={handleAnalyze} style={{ marginTop: 10, padding: "8px 16px" }}>
        Analyze
      </button>

      {report && (
        <div style={{ marginTop: 20, backgroundColor: "#eee", padding: 16, borderRadius: 8 }}>
          <p><strong>Total nodes:</strong> {report.nodesCount}</p>
          <p><strong>Total edges:</strong> {report.edgesCount}</p>
          <p><strong>Start nodes (no incoming edges):</strong> {report.startNodes.join(", ") || "None"}</p>
          <p><strong>Isolated nodes (no connections):</strong> {report.isolatedNodes.join(", ") || "None"}</p>
          <p>
            <strong>Contains cycle:</strong>{" "}
            {report.hasCycle ? "Yes 🔄 (circular reference detected)" : "No"}
          </p>
        </div>
      )}
    </div>
  );
}
