const express = require('express');
const router = express.Router();
const IndustryExperties = require('../controller/industryExperties');

// Create
router.post('/create', IndustryExperties.createIndustryExperty);

// Read
router.get('/getAll', IndustryExperties.getIndustryExperties);

router.get('/get/:id', IndustryExperties.getIndustryExpertyById);
// Update
router.put('/update/:id', IndustryExperties.updateIndustryExperty);

// Delete
router.delete('/delete/:id', IndustryExperties.deleteIndustryExperty);

module.exports = router;
