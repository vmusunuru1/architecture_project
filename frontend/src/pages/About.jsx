import React from "react";

export default function About() {
  return (
    <div className="card">
      <h1>About Mermaid Diagram Generator</h1>

      <p>
        Mermaid Diagram Generator helps you create diagrams using Mermaid syntax —
        a text-based way to build flowcharts, sequence diagrams, state diagrams,
        ER diagrams, and more. Instead of drawing boxes manually, you write a small
        snippet of text and generate a diagram from it.
      </p>

      <h2>Who this is for</h2>
      <ul>
        <li>Software engineers documenting systems and APIs</li>
        <li>Solution architects creating architecture visuals</li>
        <li>Students learning system design or UML-style diagramming</li>
        <li>Teams that want diagrams in Git and code reviews</li>
      </ul>

      <h2>Why Mermaid?</h2>
      <p>
        Mermaid diagrams are easy to version, easy to review, and easy to copy and
        edit. This makes them great for documentation and design discussions.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or feedback? Use the Contact page to reach us.
      </p>
    </div>
  );
}
