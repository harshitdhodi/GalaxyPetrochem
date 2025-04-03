const express = require('express');
const router = express.Router();
const {
  createTermsCondition,
  getAllTermsCondition,
  getTermsConditionById,
  updateTermsCondition,
  deleteTermsCondition,
} = require('../controller/termscondition');

// Create a new terms and conditions document
router.post('/add', createTermsCondition);

// Get all terms and conditions documents
router.get('/', getAllTermsCondition);

// Get a single terms and conditions document by ID
router.get('/:id', getTermsConditionById);

// Update a terms and conditions document by ID
router.put('/:id', updateTermsCondition);

// Delete a terms and conditions document by ID
router.delete('/:id', deleteTermsCondition);

module.exports = router;