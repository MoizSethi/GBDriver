const express = require("express");
const { createRide, getAllRides } = require("./controllers");

const router = express.Router();

// router.post("/create", createRide);
// router.get("/all", getAllRides);

router.get("/all/:username", getAllRides);
router.post("/create/:username", createRide);

module.exports = router;
