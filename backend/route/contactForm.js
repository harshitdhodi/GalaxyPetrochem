const express = require('express');
const router = express.Router();
const { submitContact } = require('../controller/contactForm');

router.post('/contact', submitContact);

module.exports = router;