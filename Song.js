const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: String,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
  audio: String,
  cover: String,
  playCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Song", SongSchema);

