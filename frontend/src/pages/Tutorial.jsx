import React from "react";

const Code = ({ children }) => (
  <pre className="code">
    <code>{children}</code>
  </pre>
);

export default function Tutorial() {
  return (
    <div className="card">
      <h1>Mermaid Tutorial</h1>
      <p>
        Mermaid is a text-based diagramming language. You write a short block of
        Mermaid syntax and render it as a diagram. This page includes copy/paste
        examples and best practices.
      </p>

      <h2>1) Flowcharts</h2>
      <p>Flowcharts are great for processes and decision trees.</p>
      <Code>{`flowchart TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Do Thing]
  B -->|No| D[Do Other Thing]
  C --> E[End]
  D --> E[End]`}</Code>

      <h2>2) Sequence diagrams</h2>
      <p>Sequence diagrams show interactions between actors over time.</p>
      <Code>{`sequenceDiagram
  participant U as User
  participant W as WebApp
  participant A as API

  U->>W: Click Generate
  W->>A: POST /generate
  A-->>W: SVG diagram
  W-->>U: Render result`}</Code>

      <h2>3) Best practices</h2>
      <ul>
        <li>Keep one diagram focused on one question.</li>
        <li>Use consistent names for services and components.</li>
        <li>Split large systems into overview + detail diagrams.</li>
        <li>Prefer simple labels over long paragraphs in nodes.</li>
      </ul>

      <h2>4) Troubleshooting</h2>
      <ul>
        <li>Start from a working example and expand gradually.</li>
        <li>Use quotes in labels if you include special characters.</li>
        <li>If rendering fails, reduce complexity and test step-by-step.</li>
      </ul>
    </div>
  );
}
