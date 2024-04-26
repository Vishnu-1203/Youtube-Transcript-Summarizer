const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
const cors = require("cors"); // Add this line
const app = express();
const bodyParser = require("body-parser");
const port = 5000; // You can change the port if needed

app.use(cors()); // Apply CORS middleware before your route

app.get("/transcript", async (req, res) => {
  const videoId = req.query.videoId;

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transcript" });
  }
});
app.use(bodyParser.json());

app.post("/summarize", (req, res) => {
  // Log for debugging:
  const transcript = req.body.transcript; // Access from req.body
  const instructions = req.body.instructions;

  console.log("Received Transcript:", transcript);
  console.log("Received Instructions:", instructions);

  const placeholderSummary = "This is a placeholder summary from the backend.";

  res.status(200).json({ summary: placeholderSummary });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
