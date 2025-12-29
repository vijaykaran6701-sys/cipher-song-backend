const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ======================
   CORS (VERY IMPORTANT)
====================== */
const allowedOrigins = [
  "https://cipher-song.pages.dev",
  "https://c177e6ce.cipher-song.pages.dev",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:7000"
];

console.log("Allowed frontend origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);          // allow Postman/CLI
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   FORCE LOAD MODELS
====================== */
require("./models/User");
require("./models/Artist");
require("./models/Song");

/* ======================
   STATIC FILES 
   (serve uploads properly)
====================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/frontend", express.static(path.join(__dirname, "frontend")));

/* ======================
   ROUTES
====================== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/artists", require("./routes/artists"));

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("🚀 Cipher Song Backend Running");
});

/* ======================
   DATABASE + SERVER
====================== */
const PORT = process.env.PORT || 7000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));
