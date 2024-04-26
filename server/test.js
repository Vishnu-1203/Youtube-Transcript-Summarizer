const { YoutubeTranscript } = require("youtube-transcript");

async function getTranscript() {
  const videoId = "HLi2xYxZX10"; // Your test video ID
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log(transcript);
  } catch (error) {
    console.error("Error fetching transcript:", error);
  }
}

console.log(getTranscript());
