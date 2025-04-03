const express = require('express');
const router = express.Router();
const {
    createWorldwide,
    getAllWorldwide,
    getWorldwideById,
    updateWorldwide,
    deleteWorldwide,
    addInternationalCountries,
    addIndianLocations
} = require('../controller/worldwide');

// Create new worldwide entry
router.post('/add', createWorldwide);

// Get all worldwide entries
router.get('/get', getAllWorldwide);

// Get worldwide entry by ID
router.get('/getById', getWorldwideById);

// Update worldwide entry
router.put('/updateById', updateWorldwide);

// Delete worldwide entry
router.delete('/delete', deleteWorldwide);

// Add default international countries
router.post('/add-international-countries', addInternationalCountries);

// Add Indian locations
router.post('/add-indian-locations', addIndianLocations);

module.exports = router;
