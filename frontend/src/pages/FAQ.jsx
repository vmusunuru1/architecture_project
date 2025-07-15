import React, { useState } from "react";

const faqs = [
  {
    question: "How do I write flow descriptions?",
    answer:
      "Use the format 'Node A to Node B and Node C'. This means A connects to B and C.",
  },
  {
    question: "What templates are available?",
    answer:
      "You can choose from Simple, Sequential, Complex, IoT, and Flowchart templates to quickly start.",
  },
  {
    question: "How do I save or export diagrams?",
    answer:
      "After generating a diagram, you can save it as an image or export the flow text via buttons on the left panel.",
  },
  {
    question: "What if my diagram doesn't generate correctly?",
    answer:
      "Use the Cleaner page to fix common mistakes or syntax errors in your flow descriptions.",
  },
  {
    question: "Can I share my diagrams with others?",
    answer:
      "Yes! Use the Share button after generating a diagram to copy a link you can send to others.",
  },
  {
    question: "How does the Analyzer page work?",
    answer:
      "It analyzes your flow to report node counts, detect cycles, isolated nodes, and start nodes for better insights.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>Frequently Asked Questions</h2>
      {faqs.map(({ question, answer }, i) => (
        <div
          key={i}
          style={{
            marginBottom: 12,
            borderRadius: 8,
            boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
          }}
        >
          <button
            onClick={() => toggle(i)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              background: openIndex === i ? "#007bff" : "#f9f9f9",
              color: openIndex === i ? "white" : "black",
              border: "none",
              outline: "none",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "600",
              borderRadius: "8px 8px 0 0",
            }}
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
          >
            {question}
          </button>
          {openIndex === i && (
            <div
              id={`faq-answer-${i}`}
              style={{
                padding: 16,
                backgroundColor: "#fff",
                color: "#333",
                borderRadius: "0 0 8px 8px",
                borderTop: "1px solid #ddd",
              }}
            >
              <p style={{ margin: 0, lineHeight: 1.5 }}>{answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
