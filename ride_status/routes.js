// backend/rideStatus/rideStatus.routes.js
const express = require("express");
const { updateRideStatus, getRideStatus } = require("./controllers");

const router = express.Router();
 
router.patch("/change-status/:rideId", updateRideStatus);      
router.get("/get-status/:rideId", getRideStatus);          

module.exports = router;
