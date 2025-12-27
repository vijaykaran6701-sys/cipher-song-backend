const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist", // 🔥 MUST MATCH Artist model name
      required: true,
    },

    audio: {
      type: String, // mp3 file path
      required: true,
    },

    cover: {
      type: String, // image path
    },

    playCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", SongSchema);
