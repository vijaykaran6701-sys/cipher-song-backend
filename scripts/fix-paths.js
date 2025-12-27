// Run: node scripts/fix-paths.js
const mongoose = require('mongoose');
require('dotenv').config();

const Song = require('../models/Song');
const Artist = require('../models/Artist');

function normalizePath(p) {
  if (!p) return p;
  // remove full URLs (http://localhost:7000 or https://...)
  p = p.replace(/^https?:\/\/(localhost:\d+|[\w.-]+)(:\d+)?\//, '');
  p = p.replace(/\\/g, '/');
  if (!p.startsWith('/')) p = '/' + p;
  return p;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const songs = await Song.find();
  for (const s of songs) {
    const origAudio = s.audio;
    const origCover = s.cover;
    s.audio = normalizePath(s.audio);
    s.cover = normalizePath(s.cover);
    if (s.audio !== origAudio || s.cover !== origCover) {
      await s.save();
      console.log('Updated song', s._id, { audio: s.audio, cover: s.cover });
    }
  }

  const artists = await Artist.find();
  for (const a of artists) {
    const orig = a.image;
    a.image = normalizePath(a.image);
    if (a.image !== orig) {
      await a.save();
      console.log('Updated artist', a._id, { image: a.image });
    }
  }

  console.log('Done');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});