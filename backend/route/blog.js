const express = require('express');
const router = express.Router();
const blogController = require('../controller/blog');
const image = require("../middleware/imgUpload")
// Routes for CRUD operations
router.post('/add',image,
     blogController.createBlog); // Create blog
router.get('/get', blogController.getAllBlogs); // Get all blogs
router.get('/getById', blogController.getBlogById); // Get blog by ID
router.put('/update',image,blogController.updateBlog); // Update blog by ID
router.delete('/delete', blogController.deleteBlog); // Delete blog by ID
router.get('/category', blogController.getBlogsByCategory); // Get blogs by category ID
router.get('/getLatestBlog',blogController.getLatestBlog);
router.get('/getAllBlogsExceptLatest',blogController.getAllBlogsExceptLatest);
router.get('/getBlogBySlug',blogController.getBlogBySlug)
module.exports = router;
 