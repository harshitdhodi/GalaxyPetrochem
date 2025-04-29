const express = require('express');
const router = express.Router();
const aboutUs = require('../controller/aboutUs');
const { uploadLogo } = require('../middleware/logoUpload');

// Create Stats (with image upload)
router.post('/addStats', uploadLogo, aboutUs.createStats);

// Get All Stats
router.get('/getAll', aboutUs.getAllStats);

// Get Stats by ID
router.get('/:id', aboutUs.getStatsById);

router.put('/:id', uploadLogo, aboutUs.updateStats);
// Delete Stats by ID
router.delete('/deleteStats/:id', aboutUs.deleteStats);

module.exports = router;
