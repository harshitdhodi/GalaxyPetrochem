const express = require('express');
const router = express.Router();
const inquiryController = require('../controller/productInquiry');
const { requireAuth } = require('../middleware/requireAuth');


// Get all inquiries
router.get('/getInquiries', requireAuth, inquiryController.getCountsAndData);
router.post('/createInquiry', inquiryController.createInquiry);

// Delete an inquiry by ID
router.delete('/deleteInquiries', requireAuth, inquiryController.deleteInquiry);

module.exports = router;
