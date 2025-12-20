const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ======================
   MIDDLEWARES
====================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// app.use("/api/artists", require("./routes/artists"));

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
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
