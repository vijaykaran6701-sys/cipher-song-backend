const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const Song = require("../models/Song");
const fs = require("fs");
const path = require("path");

// make sure upload folders exist
fs.mkdirSync(path.join(__dirname, "..", "uploads", "audio"), { recursive: true });
fs.mkdirSync(path.join(__dirname, "..", "uploads", "images"), { recursive: true });

/* ======================
   MULTER STORAGE
====================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") cb(null, "uploads/audio");
    else if (file.fieldname === "cover") cb(null, "uploads/images");
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* ======================
   CREATE SONG
====================== */
router.post(
  "/",
  auth,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, artist } = req.body;

      if (!title || !artist)
        return res.status(400).json({ msg: "Title and artist required" });

      // normalize stored paths
      let audioPath = "/" + req.files.audio[0].path.replace(/\\/g, "/");
      let coverPath = "/" + req.files.cover[0].path.replace(/\\/g, "/");

      const song = new Song({
        title,
        artist,
        audio: audioPath,
        cover: coverPath,
      });

      await song.save();
      res.json(song);
    } catch (err) {
      console.error("Song create error:", err);
      res.status(500).json({ msg: err.message || "Server error" });
    }
  }
);

/* ======================
   GET SONGS
====================== */
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find().populate("artist");
    res.json(songs);
  } catch (err) {
    console.error("Failed to fetch songs:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================
   UPDATE PLAY COUNT
====================== */
router.put("/:id/play", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ msg: "Song not found" });

    song.playCount = (song.playCount || 0) + 1;
    await song.save();

    res.json(song);
  } catch (err) {
    console.error("Failed to update play count:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
