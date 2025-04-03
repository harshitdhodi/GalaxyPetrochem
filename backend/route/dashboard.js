const express = require("express");
const router = express.Router();
const { getDataCount } = require("../controller/dashboard");

// Add a route for getting the data count
router.get("/dataCount", getDataCount);

module.exports = router;
