import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cleaner() {
  const [rawInput, setRawInput] = useState('');
  const [cleanedOutput, setCleanedOutput] = useState('');
  const navigate = useNavigate();

  const cleanText = (text) => {
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        if (!line.includes('to')) {
          return `⚠️ Possibly missing 'to': ${line}`;
        }
        return line;
      });

    return lines.join('\n');
  };

  const handleClean = () => {
    const result = cleanText(rawInput);
    setCleanedOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedOutput);
    alert('Cleaned text copied to clipboard!');
  };

  const handleClear = () => {
    setRawInput('');
    setCleanedOutput('');
  };

  const handleSendToGenerator = () => {
  const encoded = encodeURIComponent(cleanedOutput);
  navigate(`/?data=${encoded}`);
};

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h2>🧹 Diagram Input Cleaner</h2>
      <p>Paste your raw diagram instructions below. We’ll trim whitespace, flag issues, and make it cleaner.</p>

      <textarea
        rows={10}
        style={{ width: '100%', padding: 14, fontSize: 16, marginTop: 10 }}
        placeholder="Paste your raw input here..."
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
      />

      <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn primary" onClick={handleClean}>Clean & Preview</button>
        <button className="btn dark" onClick={handleCopy} disabled={!cleanedOutput}>Copy Cleaned</button>
        <button className="btn danger" onClick={handleClear}>Clear</button>
        <button className="btn success" onClick={handleSendToGenerator} disabled={!cleanedOutput}>Send to Generator</button>
      </div>

      {cleanedOutput && (
        <div style={{ marginTop: 30 }}>
          <h3>🧼 Cleaned Output</h3>
          <pre style={{
            background: '#f4f4f4',
            padding: 20,
            borderRadius: 8,
            color: '#333',
            overflowX: 'auto',
            fontSize: 15
          }}>
            {cleanedOutput}
          </pre>
        </div>
      )}

      <style>{`
        .btn {
          padding: 10px 16px;
          font-size: 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: white;
        }
        .primary { background-color: #007bff; }
        .dark { background-color: #343a40; }
        .danger { background-color: #dc3545; }
        .success { background-color: #28a745; }

        .btn:disabled {
          background-color: #999;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
