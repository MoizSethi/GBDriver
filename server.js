require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
const authRoutes = require("./auth-api/auth_route");

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "rootpassword",
  database: process.env.DB_NAME || "mydatabase",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// Middleware
app.use(express.json()); // ✅ Parse JSON
app.use("/auth", authRoutes); // ✅ Use routes

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Express backend is running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
