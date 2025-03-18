require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/db'); // ✅ Ensure DB is imported
const authRoutes = require('./auth-api/auth_route'); // ✅ Correct path

// ✅ Middleware
app.use(express.json()); // Parse JSON
app.use('/auth', authRoutes); // Use auth routes

// ✅ Test Database Connection & Sync Tables
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync({ alter: true }); // ✅ Sync tables without dropping data
  })
  .then(() => console.log('✅ Tables synced'))
  .catch(err => console.error('❌ Database error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
