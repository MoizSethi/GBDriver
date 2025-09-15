const express = require("express");
const { addVehicle, getVehicles } = require("./controllers");

const router = express.Router();

// ✅ Route to add a vehicle with multiple images
router.post("/add/:username", addVehicle);

// ✅ Route to get all vehicles sorted by name
router.get("/all/:username", getVehicles);

module.exports = router;
