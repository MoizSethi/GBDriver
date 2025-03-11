require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./auth-api/auth_route'); // ✅ Ensure correct path

app.use(express.json()); // ✅ Parse JSON
app.use('/auth', authRoutes); // ✅ Use routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
