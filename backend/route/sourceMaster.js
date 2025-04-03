const express = require('express');
const router = express.Router();
const {
    createsource,
    getAllsources,
    getsourceById,
    updatesourceById,
    deletesourceById,
} = require('../controller/sourceMaster');

// Routes for CRUD operations
router.post('/add', createsource); // Create
router.get('/get', getAllsources); // Read all
router.get('/getById', getsourceById); // Read one
router.put('/update', updatesourceById); // Update
router.delete('/delete', deletesourceById); // Delete

module.exports = router;
