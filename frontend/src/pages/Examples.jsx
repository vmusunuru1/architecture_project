import React from "react";

const Example = ({ title, code }) => (
  <div style={{ marginBottom: 18 }}>
    <h3 style={{ marginBottom: 6 }}>{title}</h3>
    <pre className="code"><code>{code}</code></pre>
  </div>
);

export default function Examples() {
  return (
    <div className="card">
      <h1>Mermaid Examples</h1>
      <p>
        Copy/paste these templates into the generator to get started quickly.
      </p>

      <Example
        title="Simple architecture diagram"
        code={`flowchart LR
  U[User] --> W[Web App]
  W --> A[API]
  A --> D[(Database)]
  A --> Q[(Queue)]
  Q --> J[Worker]`}
      />

      <Example
        title="State diagram"
        code={`stateDiagram-v2
  [*] --> Idle
  Idle --> Generating: submit
  Generating --> Rendered: success
  Generating --> Error: failure
  Rendered --> Idle: reset
  Error --> Idle: retry`}
      />

      <Example
        title="ER diagram"
        code={`erDiagram
  USER ||--o{ DIAGRAM : creates
  USER {
    string id
    string email
  }
  DIAGRAM {
    string id
    string title
    datetime created_at
  }`}
      />
    </div>
  );
}
