import React, { useState, useEffect } from "react";
import "./styles.css"; // Assuming you have some CSS styles

const TranscriptInput = () => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  async function sendSummarizationRequest(transcript, instructions = null) {
    try {
      const summarizationRequest = {
        transcript: transcript,
        instructions: instructions, // Allow optional instructions
      };

      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summarizationRequest),
      });

      if (!response.ok) {
        throw new Error(
          `Summarization request failed with status: ${response.status}`
        );
      }

      const data = await response.json();
      return data.summary; // Return the summarized text
    } catch (error) {
      console.error("Error sending summarization request:", error);
      throw error; // Re-throw the error to allow callers to handle it
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic input validation
    const validUrlRegex =
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+(&\S*)?$/;
    if (!validUrlRegex.test(youtubeLink)) {
      setError("Please enter a valid YouTube link.");
      return;
    }

    const videoId = youtubeLink.split("v=")[1];

    try {
      setLoading(true);
      setError("");

      // Fetch and extract transcript
      await fetchAndExtractTranscript(videoId);

      // Proceed to send summarization request
      const instructions = "Summarize the key points concisely.";
      const summary = await sendSummarizationRequest(
        transcriptText,
        instructions
      );
      setSummary(summary);
      console.log(summary);
    } catch (error) {
      setError("An error occurred during transcript fetch or summarization");
    } finally {
      setLoading(false);
    }
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

  const handleChange = (event) => {
    setYoutubeLink(event.target.value);
  };

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
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {transcriptText && (
        <div className="transcript-section">
          <h2 className="transcript-heading">Transcript</h2>
          <p className="transcript-content">{transcriptText}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptInput;
