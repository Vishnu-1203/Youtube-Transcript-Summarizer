import React, { useState } from "react";
import "./styles.css"; // Assuming you have some CSS styles

const TranscriptInput = () => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [instructionSum, setInstructionSum] = useState(""); // Default value

  async function sendSummarizationRequest(
    transcript,
    instructions = null,
    youtubeLink
  ) {
    try {
      const summarizationRequest = {
        videoLink: youtubeLink,
        transcript: transcript,
        instructions: instructionSum, // Allow optional instructions
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
    setSummary(""); // Reset summary before a new request

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

      if (instructionSum.trim() === "") {
        setInstructionSum("Summarize the key points concisely");
      }

      // Build request data (include youtubeLink)
      const requestData = {
        youtubeLink: youtubeLink, // Store the link with the key 'youtubeLink'
        transcript: transcriptText || "",
        instructions: instructionSum,
      };
      console.log("requestData:", requestData);

      // Send summarization request with the new data structure
      const summary = await sendSummarizationRequest(
        requestData.transcript,
        requestData.instructions,
        requestData.youtubeLink
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
        `https://ytsbackend.netlify.app/transcript?videoId=${videoId}`
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
      <form onSubmit={handleSubmit} className="form-input">
        <input
          type="text"
          className="youtube-link-input averia-serif-libre-regular-italic"
          placeholder="Paste your YouTube link here"
          value={youtubeLink}
          onChange={handleChange}
        />
        <input
          type="text"
          className="instructions-input averia-serif-libre-regular-italic"
          placeholder="Enter summarization instructions"
          value={instructionSum}
          onChange={(event) => setInstructionSum(event.target.value)}
        />
        <div id="submit-button1">
          <button
            type="submit"
            className="submit-button averia-serif-libre-regular"
          >
            Submit
          </button>
        </div>
      </form>
      <div className="output-section">
        {loading && (
          <p className="averia-serif-libre-light-italic">Loading...</p>
        )}
        {error && <p className="error-message">{error}</p>}
        {summary && (
          <div className="summary-section">
             
            <h2 className="summary-heading averia-serif-libre-regular">
              Summary
            </h2>
            <p className="summary-content averia-serif-libre-bold-italic">
              {summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptInput;
