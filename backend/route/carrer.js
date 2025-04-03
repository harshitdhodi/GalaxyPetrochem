  const express = require('express');
const router = express.Router();
const { 
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication } = require('../controller/career');
const upload = require('../middleware/chemicalImage'); // If file upload is needed

// Public routes (if needed)
router.post('/add', upload, submitApplication);
router.get('/get', getAllApplications);
router.get('/getById', getApplicationById);

// Protected routes (if authentication is required)
router.put('/update',  upload, updateApplication);
router.delete('/delete',  deleteApplication);

module.exports = router;
