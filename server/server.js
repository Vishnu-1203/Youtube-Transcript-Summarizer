const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
const cors = require("cors"); // Add this line
const app = express();
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
