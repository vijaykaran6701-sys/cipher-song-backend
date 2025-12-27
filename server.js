const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ======================
   MIDDLEWARES
====================== */
const FRONTEND_ORIGINS = [process.env.FRONTEND_ORIGIN || "https://cipher-songs2.pages.dev", "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:7000"];
app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser requests (like CLI tools) when origin is undefined
    if (!origin) return cb(null, true);
    if (FRONTEND_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error("CORS policy: Origin not allowed"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   FORCE LOAD MODELS 🔥
====================== */
require("./models/User");
require("./models/Artist");
require("./models/Song");

/* ======================
   STATIC FILES
====================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/frontend", express.static(path.join(__dirname, "frontend")));

/* ======================
   ROUTES
====================== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/artists", require("./routes/artists")); // optional but recommended

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("🚀 Cipher Song Backend Running");
});

/* ======================
   DATABASE + SERVER
====================== */
const PORT = process.env.PORT || 7000; // default port

console.log("Allowed frontend origins:", FRONTEND_ORIGINS);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
