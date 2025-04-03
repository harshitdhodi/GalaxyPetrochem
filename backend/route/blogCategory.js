const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controller/blogCategory'); // Path to the controller file

// Route to create a new category
router.post('/add', createCategory);

// Route to get all categories
router.get('/get', getAllCategories);

// Route to get a category by ID
router.get('/getById', getCategoryById);

// Route to update a category by ID
router.put('/update', updateCategory);

// Route to delete a category by ID
router.delete('/delete', deleteCategory);

module.exports = router;
