import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false });

export default function MermaidChart({ chart, scale = 1 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    const renderMermaid = async () => {
      const id = "mermaid-" + Math.floor(Math.random() * 1000000);

      try {
        const { svg } = await mermaid.render(id, chart);
        containerRef.current.innerHTML = svg;

        if (scale !== 1) {
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.transformOrigin = "0 0";
            svgEl.style.transform = `scale(${scale})`;
          }
        }
      } catch (err) {
        console.error("❌ Mermaid render error:", err);
        containerRef.current.innerHTML = `<pre style="color:red;">Mermaid render error:\n${err.message}</pre>`;
      }
    };

    renderMermaid();
  }, [chart, scale]);

  return <div ref={containerRef} />;
}
