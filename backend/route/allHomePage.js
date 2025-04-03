const express = require('express');
const router = express.Router();
const apiController = require('../controller/allHomePage');

// Single route for all home page data
router.get('/getAllHomePage', apiController.getAllHomePage);

module.exports = router;