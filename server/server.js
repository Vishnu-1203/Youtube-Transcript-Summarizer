const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
const cors = require("cors"); // Add this line
const app = express();
const bodyParser = require("body-parser");
const port = 5000; // You can change the port if needed

app.use(cors()); // Apply CORS middleware before your route

require("dotenv").config(); // Load environment variables
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.get("/transcript", async (req, res) => {
  const videoId = req.query.videoId;

  try {
    // Artificial Delay (Adjust as needed)
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 5 seconds

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    res.json(transcript);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    res.status(500).json({ error: "Failed to fetch transcript" });
  }
});

app.use(bodyParser.json());

app.post("/summarize", async (req, res) => {
  try {
    let transcript = req.body.transcript;
    let instructions =
      req.body.instructions || "Summarize the key points concisely.";
    let videoLink = req.body.videoLink;
    console.log(videoLink, ":the video link");

    console.log("Received Transcript:", transcript);
    console.log("Received Instructions:", instructions);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt =
      transcript +
      "\n Instructions: " +
      instructions +
      videoLink +
      "\n use the link if transcript not available, always make sure both transcript and youtube link content are refering to the same video, if not prioritize the content in the link";
    const response = await model.generateContent(prompt);
    const geminiSummary = await response.response.text();

    res.status(200).json({ summary: geminiSummary });

    // Reset variables for the next request
    transcript = "";
    instructions = "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ message: "Failed to generate summary" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
