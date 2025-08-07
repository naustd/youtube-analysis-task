const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
require("dotenv").config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

async function transcribeAudio(audioPath, requestId) {
  const transcriptDir = path.join(
    __dirname,
    "../../public/uploads/transcripts"
  );
  fs.mkdirSync(transcriptDir, { recursive: true });

  try {
    // ✅ Ensure file exists
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(audioPath)); // ✅ correct field name
    form.append("model_id", "scribe_v1"); // ✅ correct model
    form.append("language_code", "en"); // optional
    form.append("diarize", "true"); // optional

    const headers = {
      ...form.getHeaders(),
      "xi-api-key": ELEVENLABS_API_KEY,
    };

    const response = await axios.post(
      "https://api.elevenlabs.io/v1/speech-to-text", // ✅ fixed endpoint
      form,
      {
        headers,
        maxBodyLength: Infinity,
      }
    );

    // Save to file
    const transcriptPath = path.join(transcriptDir, `${requestId}.json`);
    fs.writeFileSync(transcriptPath, JSON.stringify(response.data, null, 2));
    console.log(`✅ Transcript saved to: ${transcriptPath}`);

    return response.data;
  } catch (error) {
    console.error(
      "Transcription error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to transcribe audio");
  }
}

module.exports = { transcribeAudio };
