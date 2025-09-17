const express = require("express");
const { createRide, getAllRides, getDriverProgress } = require("./controllers");

const router = express.Router();

// router.post("/create", createRide);
// router.get("/all", getAllRides);

router.get("/all/:username", getAllRides);
router.get("/progress/:username", getDriverProgress);
router.post("/create/:username", createRide);

module.exports = router;
