const express = require('express');
const router = express.Router();
const emailCategoryController = require('../controller/emailCategory');

// Create
router.post('/addCategory', emailCategoryController.createEmailCategory);

// Read
router.get('/getCategories', emailCategoryController.getEmailCategories);
router.get('/categoryByID', emailCategoryController.getEmailCategoryById);

// Update
router.put('/updateCategory', emailCategoryController.updateEmailCategory);

// Delete
router.delete('/deleteCategory', emailCategoryController.deleteEmailCategory);

module.exports = router;