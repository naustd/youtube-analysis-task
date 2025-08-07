const axios = require("axios");
require("dotenv").config();
const AI_DETECTOR_KEY = process.env.AI_DETECTOR_KEY;

async function analyzeWithGPTZero(transcript, requestId) {
  try {
    const sentences = [];
    // Assuming transcript has word-level timestamps with 'text' property
    if (transcript.words && Array.isArray(transcript.words)) {
      let currentSentence = "";
      for (const word of transcript.words) {
        currentSentence += word.text + " ";
        if (
          word.text.endsWith(".") ||
          word.text.endsWith("!") ||
          word.text.endsWith("?")
        ) {
          sentences.push(currentSentence.trim());
          currentSentence = "";
        }
      }
      if (currentSentence.trim().length > 0) {
        sentences.push(currentSentence.trim());
      }
    } else if (transcript.text) {
      // Fallback if structure is different
      sentences.push(
        ...transcript.text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      );
    }
    const analyzedSentences = [];
    for (const sentence of sentences) {
      if (!sentence.trim()) continue;

      const response = await axios.post(
        "https://api.copyleaks.com/v3/ai-content-detector",
        { document: sentence },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AI_DETECTOR_KEY}`,
          },
        }
      );

      analyzedSentences.push({
        text: sentence,
        ai_probability: response.data.documents[0].ai_probability || 0,
      });
    }
    // Add analysis to transcript
    return {
      ...transcript,
      sentences: analyzedSentences,
    };
  } catch (error) {
    console.error(
      "GPTZero analysis error:",
      error.response?.data || error.message
    );
    // Return original transcript if analysis fails
    return transcript;
  }
}

module.exports = { analyzeWithGPTZero };
