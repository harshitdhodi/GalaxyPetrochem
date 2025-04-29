// routes/userPhotoRoutes.js
const express = require('express');
const router = express.Router();
const {uploadLogo} = require("../middleware/logoUpload")
const {
  createUserPhoto,
  getAllUserPhotos,
  getUserPhotoById,
  updateUserPhoto,
  deleteUserPhoto,
} = require('../controller/brand');

// POST: Create user with photo
router.post('/addBrand', uploadLogo , createUserPhoto);

// GET: All users
router.get('/', getAllUserPhotos);

// GET: User by ID
router.get('/:id', getUserPhotoById);

// PUT: Update user
router.put('/:id', uploadLogo , updateUserPhoto);

// DELETE: Delete user
router.delete('/:id', deleteUserPhoto);

module.exports = router;
