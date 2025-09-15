const express = require("express");
const { registerUser } = require("./controllers");
const { loginUser } = require("./controllers");

const router = express.Router();

router.post("/register/:username", registerUser);
router.post("/login/:username", loginUser);

module.exports = router;
