const express = require('express');
const { sendEmail } = require('../controller/email');
const upload = require('../middleware/emailFile')
const router = express.Router();

// POST API to send email
router.post('/sendEmail', upload.single('attachment'), sendEmail);

module.exports = router;
