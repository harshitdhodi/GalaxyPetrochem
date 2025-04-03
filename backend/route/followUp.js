// routes/messageRoutes.js
const express = require('express');
const { 
  createMessage, 
  getMessages, 
  getMessageById, 
  updateMessage, 
  deleteMessage ,
  getMessagesByInquiryId,
  getMessagesCountByInquiryId,
  getTodayMessages
} = require('../controller/followup');

const router = express.Router();

// Create a new message (POST)
router.post('/add', createMessage);

// Get all messages (GET)
router.get('/get', getMessages);

//Get todat message 
router.get('/getTodayMessages', getTodayMessages);

// Get a single message by ID (GET)
router.get('/getById', getMessageById);

// Get a single message by inquiry ID (GET)
router.get('/getByInquiryId', getMessagesByInquiryId);

// Get count by inquiry ID (GET)
router.get('/getCountByInquiryId', getMessagesCountByInquiryId);

// Update a message by ID (PUT)
router.put('/update', updateMessage);

// Delete a message by ID (DELETE)
router.delete('/delete', deleteMessage);

module.exports = router;
