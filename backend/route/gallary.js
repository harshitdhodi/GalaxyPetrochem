// routes/itemRoutes.js - Express Routes
const express = require('express');
const router = express.Router();
const gallaryController = require('../controller/gallary');
const { uploadLogo } = require('../middleware/logoUpload');

// CREATE - POST /api/items
router.post('/create',uploadLogo, gallaryController.createItem);

// READ - GET /api/items (get all)
router.get('/all', gallaryController.getAllItems);

// READ - GET /api/items/single (get by ID using query parameter)
router.get('/single', gallaryController.getItemById);

// UPDATE - PUT /api/items/update (update by ID using query parameter)
router.put('/update/:id',uploadLogo, gallaryController.updateItem);

// DELETE - DELETE /api/items/delete (delete by ID using query parameter)
router.delete('/delete/:id', gallaryController.deleteItem);

module.exports = router;