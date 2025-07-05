const express = require("express");
const { registerUser } = require("./controllers");
const { loginUser } = require("./controllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
