const express = require('express');
const router = express.Router();
const noteController = require('../controller/emailTemplate');

// Routes for Notes
router.post('/add', noteController.createNote);
router.get('/get', noteController.getAllNotes);
router.get('/getById', noteController.getNoteById);
router.put('/update', noteController.updateNote);
router.delete('/delete', noteController.deleteNote);

module.exports = router;
