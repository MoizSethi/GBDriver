// network.routes.js
const express = require('express');
const router = express.Router();
const networkController = require('./controllers');

// POST /api/network/expose
router.post('/expose', networkController.exposeRide);

// POST /api/network/accept
router.post('/accept', networkController.acceptRide);

// GET /api/network/all
router.get('/all', networkController.getExposedRides);

module.exports = router;
