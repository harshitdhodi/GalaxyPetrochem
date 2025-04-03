const express = require('express');
const router = express.Router();
const blogCardController = require('../controller/blogCard');

// Create a new blog card
router.post('/addCard', blogCardController.createBlogCard);

// Get all blog cards
router.get('/getCard', blogCardController.getAllBlogCards);

// Get a single blog card by ID
router.get('/:id', blogCardController.getBlogCardById);

// Update a blog card by ID
router.put('/editCard/:id', blogCardController.updateBlogCard);

// Delete a blog card by ID
router.delete('/:id', blogCardController.deleteBlogCard);

module.exports = router;