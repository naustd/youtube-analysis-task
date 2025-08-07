const express = require("express");
const router = express.Router();
const { takeScreenshot } = require("../services/screenshot");
const { downloadAndConvertAudio } = require("../services/downloader");
const { transcribeAudio } = require("../services/transcription");
// const { saveTranscript } = require("../utils/storage");
const { generateId } = require("../utils/idGenerator");

router.post("/", async (req, res, next) => {
  try {
    const { youtubeUrl } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({ error: "YouTube URL is required" });
    }

    // Generate unique ID for this request
    const requestId = generateId();

    // Step 1: Take screenshot of YouTube video
    const screenshotPath = await takeScreenshot(youtubeUrl, requestId);

    // Step 2: Download and convert audio
    const { absolutePath, publicPath } = await downloadAndConvertAudio(
      youtubeUrl,
      requestId
    );

    // Step 3: Transcribe with ElevenLabs
    let transcript = await transcribeAudio(publicPath, requestId);
    console.log("Transcript", transcript);

    // // Step 4: Analyze with GPTZero
    // transcript = await analyzeWithGPTZero(transcript, requestId);

    // Step 5: Save all results
    // const result = {
    //   id: requestId,
    //   youtubeUrl,
    //   screenshotPath,
    //   audioPath,
    //   transcript,
    //   createdAt: new Date().toISOString(),
    // };

    // await saveTranscript(result, requestId);

    res.status(200).json({
      status: "processing",
      id: requestId,
      message: "Transcription in progress. Use the ID to check results later.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
