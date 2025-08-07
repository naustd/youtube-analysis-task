const fs = require("fs");
const path = require("path");
require("dotenv").config();

const uploadsDir = path.join(__dirname, "../../public/uploads/transcripts");
async function saveTranscript(data, id) {
  // Ensure the uploads directory exists
  fs.mkdirSync(uploadsDir, { recursive: true });
  try {
    const filePath = path.join(uploadsDir, `${id}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving transcript:", error);
    throw error;
  }
}

async function getTranscript(id) {
  try {
    const filePath = path.join(uploadsDir, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading transcript:", error);
    throw error;
  }
}

module.exports = { saveTranscript, getTranscript };
