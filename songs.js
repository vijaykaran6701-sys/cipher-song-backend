const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const Song = require("../models/Song");

// Ensure folders exist manually once:
// backend/uploads/audio
// backend/uploads/images

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") {
      cb(null, "uploads/audio");
    } else if (file.fieldname === "cover") {
      cb(null, "uploads/images");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

      if (!title || !artist) {
        return res.status(400).json({ msg: "Title and artist required" });
      }

      const song = new Song({
        title,
        artist,
        audio: req.files.audio[0].path,
        cover: req.files.cover[0].path,
      });

      await song.save();
      res.json(song);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.get("/", async (req, res) => {
  const songs = await Song.find().populate("artist");
  res.json(songs);
});

module.exports = router;
router.put("/:id/play", async (req, res) => {
  const song = await Song.findById(req.params.id);
  song.playCount += 1;
  await song.save();
  res.json(song);
});
