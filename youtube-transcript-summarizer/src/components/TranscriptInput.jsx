import React, { useState, useEffect } from "react";
import "./styles.css";

const TranscriptInput = () => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [instructions, setInstructions] = useState("");
  const [showInstructionsInput, setShowInstructionsInput] = useState(false);
  const handleShowInstructions = () => {
    setShowInstructionsInput(!showInstructionsInput);
  };

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setYoutubeLink(value); // Assuming you're setting youtubeLink
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validUrlRegex =
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+(&\S*)?$/;
    if (!validUrlRegex.test(youtubeLink)) {
      setError("Please enter a valid YouTube link.");
      return;
    }

    const videoId = youtubeLink.split("v=")[1];
    fetchAndExtractTranscript(videoId);
  };

  const fetchAndExtractTranscript = async (videoId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/transcript?videoId=${videoId}`
      );
      const transcriptData = await response.json();

      const extractedText = transcriptData.map((item) => item.text).join(" ");
      setTranscriptText(extractedText);
    } catch (error) {
      setError("Error fetching transcript");
    } finally {
      setLoading(false);
    }
  };

  const sendForSummary = async () => {
    // Removed videoId
    try {
      setLoading(true);
      setError("");
      console.log("Data to send:", {
        transcript: transcriptText,
        instructions,
      });
      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptText, // Send the transcript
          instructions,
        }),
      });

      const data = await response.json();
      setSummary(data.summary); // Update with the received summary
    } catch (error) {
      setError("Error fetching or summarizing transcript");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only call fetch on submit button click (when youtubeLink has a value)
    if (youtubeLink) {
      const fetchAndSummarize = async () => {
        try {
          setLoading(true);
          setError("");

          const videoId = youtubeLink.split("v=")[1];
          const transcriptData = await fetch(
            `http://localhost:5000/transcript?videoId=${videoId}`
          ).then((response) => response.json());

          const extractedText = transcriptData
            .map((item) => item.text)
            .join(" ");
          setTranscriptText(extractedText);

          const response = await fetch("http://localhost:5000/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript: extractedText, instructions }),
          }).then((response) => response.json());

          const data = await response;
          setSummary(data.summary);
        } catch (error) {
          setError("Error fetching or summarizing transcript");
        } finally {
          setLoading(false);
        }
      };

      fetchAndSummarize();
    }
  }, [youtubeLink]);
  return (
    <div className="transcript-input-container">
      <h2 className="transcript-heading">Input your YouTube link</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="youtube-link-input"
          placeholder="Paste your YouTube link here"
          value={youtubeLink}
          onChange={handleChange}
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      <button onClick={handleShowInstructions}>Toggle Instructions</button>
      {showInstructionsInput && (
        <div className="instructions-container">
          <label htmlFor="instructions">
            Enter instructions for summarization:
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {transcriptText && (
        <div className="transcript-section">
          <h2 className="transcript-heading">Transcript</h2>
          <p className="transcript-content">{transcriptText}</p>
        </div>
      )}

      {summary && (
        <div className="summary-section">
          <h2 className="summary-heading">Summary</h2>
          <p className="summary-content">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptInput;
