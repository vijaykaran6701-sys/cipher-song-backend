const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FILES (MOST IMPORTANT)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/frontend", express.static(path.join(__dirname, "frontend")));

// Routes
//app.use("/api/auth", require("./routes/auth"));
const authRoutes = require("./routes/auth");
app.use("/api/artists", require("./routes/artists"));
app.use("/api/songs", require("./routes/songs"));

// Test route
app.get("/", (req, res) => {
  res.send("Cipher Song Backend Running");
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
