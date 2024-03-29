import React, { useState } from "react";
import "./styles.css";

const TranscriptInput = () => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic input validation
    const validUrlRegex = /^https:\/\/www\.youtube\.com\/watch\?v=\w+$/;
    if (!validUrlRegex.test(youtubeLink)) {
      setError("Please enter a valid YouTube link.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const videoId = youtubeLink.split("v=")[1];
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=AIzaSyCy3UYppcWp_ooOB33mS8gTvS8YVjIEbmc` // Replace with your API key
      );

      if (!response.ok) {
        throw new Error("Failed to fetch captions. Please try again.");
      }

      const data = await response.json();

      if (!data || !data.items || data.items.length === 0) {
        throw new Error("Captions data not found.");
      }

      const captionText =
        data.items[0].snippet.track.snippet.localized.transcript;
      if (!captionText) {
        throw new Error("Transcript not found in captions data.");
      }

      setTranscript(captionText);
    } catch (error) {
      setError(error.message || "An error occurred while fetching captions.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setYoutubeLink(event.target.value); // Update the input value state
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
          onChange={handleChange} // Call handleChange on input change
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {transcript && (
        <div className="transcript-section">
          <h2 className="transcript-heading">Transcript</h2>
          <p className="transcript-content">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptInput;
