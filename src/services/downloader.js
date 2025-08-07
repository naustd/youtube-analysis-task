const ytdl = require("@distube/ytdl-core");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function downloadAndConvertAudio(youtubeUrl, requestId) {
  // 1. Ensure audio output directory exists
  const audioDir = path.join(__dirname, "../../public/uploads/audio");
  fs.mkdirSync(audioDir, { recursive: true });

  // 2. File paths
  const tempPath = path.join(audioDir, `${requestId}_temp.mp3`);
  const outputPath = path.join(audioDir, `${requestId}.wav`);
  const publicPath = path.join(
    __dirname,
    `../../public/uploads/audio/${requestId}.wav`
  ); // for serving over Express

  console.log("🔊 Saving audio to:", outputPath);

  // 3. Return a Promise
  return new Promise((resolve, reject) => {
    const audioStream = ytdl(youtubeUrl, {
      quality: "highestaudio",
      filter: "audioonly",
    });

    const writeStream = fs.createWriteStream(tempPath);
    audioStream.pipe(writeStream);

    writeStream.on("finish", () => {
      ffmpeg(tempPath)
        .audioFrequency(16000)
        .audioChannels(1)
        .audioCodec("pcm_s16le")
        .format("wav")
        .on("error", (err) => {
          console.error("❌ FFmpeg error:", err);
          reject(err);
        })
        .on("end", () => {
          fs.unlink(tempPath, (err) => {
            if (err) console.warn("⚠️ Failed to delete temp MP3:", err);
          });

          // ✅ Return both absolute path for transcription and public path for frontend
          resolve({
            absolutePath: outputPath, // for use in fs.readFile() or ElevenLabs
            publicPath: publicPath, // for serving to frontend
          });
        })
        .save(outputPath);
    });

    writeStream.on("error", reject);
  });
}

module.exports = { downloadAndConvertAudio };
