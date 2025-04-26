// controllers/userPhotoController.js
const UserPhoto = require('../model/brands');
const fs = require('fs');
const path = require('path');

// CREATE
exports.createUserPhoto = async (req, res) => {
    try {
      const { name, slug } = req.body;
      const photo = req.files && req.files.photo ? req.files.photo[0].filename : null;
  
      const newUser = await UserPhoto.create({ name, slug, photo });
      res.status(201).json({ message: 'User photo created successfully', data: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user photo', error: error.message });
    }
  };
  

// READ ALL
exports.getAllUserPhotos = async (req, res) => {
  try {
    const users = await UserPhoto.find();
    res.status(200).json({ message: 'Users fetched', data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// READ BY ID
exports.getUserPhotoById = async (req, res) => {
  try {
    const user = await UserPhoto.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User found', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// UPDATE
exports.updateUserPhoto = async (req, res) => {
  try {
    const { name , slug } = req.body;
    const id = req.params.id;

    const existingUser = await UserPhoto.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old photo if new one is uploaded
    if (req.files && req.files.photo && existingUser.photo) {
      const oldPhotoPath = path.join(__dirname, '../uploads', existingUser.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    const updatedData = {
      name: name || existingUser.name,
      slug: slug || existingUser.slug,
      photo: req.files && req.files.photo ? req.files.photo[0].filename : existingUser.photo,
    };

    const updatedUser = await UserPhoto.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// DELETE
exports.deleteUserPhoto = async (req, res) => {
  try {
    const user = await UserPhoto.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.photo) {
      const photoPath = path.join(__dirname, '../uploads', user.photo);
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }

    await UserPhoto.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};
