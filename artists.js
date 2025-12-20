const router = require("express").Router();
const Artist = require("../models/Artist");

router.post("/", async (req, res) => {
  const artist = await Artist.create(req.body);
  res.json(artist);
});

router.get("/", async (req, res) => {
  const artists = await Artist.find();
  res.json(artists);
});

module.exports = router;

