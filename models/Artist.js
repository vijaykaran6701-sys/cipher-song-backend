const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    image: {
      type: String, // image filename / url
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artist", ArtistSchema);
