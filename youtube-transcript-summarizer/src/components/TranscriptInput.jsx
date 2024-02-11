// TranscriptInput.jsx
import React from "react";
import "./styles.css";

const TranscriptInput = () => {
  return (
    <div className="transcript-input-container">
      <h2 className="transcript-heading">Input your YouTube link</h2>
      <textarea
        className="transcript-textarea"
        placeholder="Paste your YouTube link here"
      ></textarea>
      <div className="summary-section">
        <h2 className="summary-heading">Summary</h2>
        <p className="summary-content">
          This is where the summary content will appear...
        </p>
      </div>
    </div>
  );
};

export default TranscriptInput;
