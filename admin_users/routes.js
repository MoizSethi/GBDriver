// admin-user/routes.js

const express = require('express');
const router = express.Router();
const controller = require('./controllers');

router.post('/create', controller.createAdminUser);
router.post('/login', controller.loginAdminUser);
router.get('/all', controller.getAllAdminUsers);

module.exports = router;
