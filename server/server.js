const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
const cors = require("cors"); // Add this line
const app = express();
const port = 5000; // You can change the port if needed
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
app.use(cors()); // Apply CORS middleware before your route

app.get("/transcript", async (req, res) => {
  const videoId = req.query.videoId;

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    res.json(transcript);
    console.log("Transcript request received!");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transcript" });
  }
});

app.post("/summarize", async (req, res) => {
  console.log("Summarize Request Body:", req.body);
  const { transcript, instructions } = req.body;

  try {
    console.log("summary request received!");
    // Generate summary with Gemini
    const prompt = transcript + instructions; // Adjust how you combine transcript and instructions if needed
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedSummary = response.text();

    res.json({ summary: generatedSummary }); // Send back the summary
  } catch (error) {
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
