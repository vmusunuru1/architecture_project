import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false });

export default function MermaidChart({ chart }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    const renderMermaid = async () => {
      const id = "mermaid-" + Math.floor(Math.random() * 1000000);

      try {
        const { svg } = await mermaid.render(id, chart);
        containerRef.current.innerHTML = svg;
      } catch (err) {
        console.error("❌ Mermaid render error:", err);
        containerRef.current.innerHTML = `<pre style="color:red;">Mermaid render error:\n${err.message}</pre>`;
      }
    };

    renderMermaid();
  }, [chart]);

  return <div ref={containerRef} />;
}     
