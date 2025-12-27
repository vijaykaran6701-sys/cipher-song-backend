const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Artist = require("../models/Artist");

// ensure upload dir exists
const imagesDir = path.join(__dirname, "..", "uploads", "images");
fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only images allowed (jpeg|png|gif|webp)"));
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, desc } = req.body;
    if (!name) return res.status(400).json({ msg: "Artist name required" });

    const artistData = { name, bio: desc || "" };
    if (req.file) {
      let imgPath = path.join("uploads", "images", req.file.filename).replace(/\\/g, "/");
      if (!imgPath.startsWith("/")) imgPath = "/" + imgPath;
      artistData.image = imgPath;
    }

    const artist = await Artist.create(artistData);
    res.status(201).json(artist);
  } catch (err) {
    console.error("Artist create error:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

