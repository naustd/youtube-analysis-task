const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

async function takeScreenshot(youtubeUrl, requestId) {
  // Target directory: src/public/uploads
  const uploadsDir = path.join(__dirname, "../../public/uploads/screenshots");

  // Ensure the uploads directory exists
  fs.mkdirSync(uploadsDir, { recursive: true });

  // Final screenshot file path
  const screenshotPath = path.join(uploadsDir, `${requestId}.png`);
  console.log("Saving screenshot to:", screenshotPath);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  try {
    await page.goto(youtubeUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector(".html5-video-player", { timeout: 10000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await page.screenshot({ path: screenshotPath });

    return screenshotPath;
  } catch (err) {
    console.error("Screenshot failed:", err.message);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { takeScreenshot };
