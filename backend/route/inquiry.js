const express = require('express');
const router = express.Router();
const contactController = require('../controller/inquiry');

router.get('/get', contactController.getAllInquiries);
router.get('/getById', contactController.getInquiryById);
router.post('/add', contactController.createInquiry);
router.put('/update', contactController.updateInquiry);
router.delete('/delete', contactController.deleteInquiry);
router.get('/getTodayInquiries',contactController.getTodayInquiries);
module.exports = router;
