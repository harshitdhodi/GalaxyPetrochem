const express = require('express');
const router = express.Router();
const missionVision = require('../controller/missionVision');

// CREATE
router.post('/add', missionVision.createExpertiseContent);

// READ All
router.get('/get', missionVision.getAllExpertiseContent);

// READ Single by ID
router.get('/getById/:id', missionVision.getExpertiseContentById);

// UPDATE by ID
router.put('/updateById', missionVision.updateExpertiseContent);

// delete (points)   
router.put('/deleteSpecificPoint', missionVision.deleteSpecificPoint);

// DELETE by ID
router.delete('/delete/:id', missionVision.deleteExpertiseContent);

module.exports = router;
