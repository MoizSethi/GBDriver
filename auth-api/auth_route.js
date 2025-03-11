const express = require('express');
const router = express.Router();
const authController = require('./auth_controller'); // ✅ Import properly

// ✅ Ensure functions exist before using them
if (!authController.register || !authController.signIn) {
  throw new Error('authController functions are undefined. Check imports.');
}

// Routes
router.post('/register', authController.register);
router.post('/login', authController.signIn);

module.exports = router;
