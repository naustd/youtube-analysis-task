const express = require("express");
const router = express.Router();
const { getTranscript } = require("../utils/storage");

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const transcript = await getTranscript(id);

    if (!transcript) {
      return res.status(404).json({ error: "Transcript not found" });
    }

    res.status(200).json(transcript);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
