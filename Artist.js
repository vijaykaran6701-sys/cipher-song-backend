const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
  name: String,
  bio: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Artist", ArtistSchema);

