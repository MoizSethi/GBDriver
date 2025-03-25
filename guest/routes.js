const express = require("express");
const { registerGuest } = require("./controllers");

const router = express.Router();

router.post("/register", registerGuest);

module.exports = router;
