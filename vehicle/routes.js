const express = require("express");
const { addVehicle, getVehicles } = require("./controllers");

const router = express.Router();

// ✅ Route to add a vehicle with multiple images
router.post("/add", addVehicle);

// ✅ Route to get all vehicles sorted by name
router.get("/all", getVehicles);

module.exports = router;
