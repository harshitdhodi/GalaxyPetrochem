const express = require('express');
const router = express.Router();
const {
    createstatus,
    getAllstatuss,
    getstatusById,
    updatestatusById,
    deletestatusById,
} = require('../controller/statusMaster');

// Routes for CRUD operations
router.post('/add', createstatus); // Create
router.get('/get', getAllstatuss); // Read all
router.get('/getById', getstatusById); // Read one
router.put('/update', updatestatusById); // Update
router.delete('/delete', deletestatusById); // Delete

module.exports = router;
