// controllers/itemController.js - CRUD Controller
const Gallary = require('../model/gallary');
const path = require('path');
const fs = require('fs');
// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { title, altName, imgTitle } = req.body;

    // Validate required fields
    if (!title || !altName || !imgTitle) {
      return res.status(400).json({ message: 'Title, altName, and imgTitle are required' });
    }

    // Check if an image file was uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Get the filename of the processed image from Multer
    const image = req.files.image[0].filename;

    // Create new gallery item
    const item = new Gallary({
      title,
      image: `${image}`, // Store relative path to the image
      altName,
      imgTitle
    });

    // Save to database
    await item.save();
    res.status(201).json({ message: 'Item created successfully', data: item });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Gallary.find();
    console.log(items);
    res.status(200).json({ message: 'Items fetched successfully', data: items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.query;

    const item = await Gallary.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item fetched successfully", data: item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, altName, imgTitle } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    // Prepare update object
    const updateData = {};
    if (title) updateData.title = title;
    if (altName) updateData.altName = altName;
    if (imgTitle) updateData.imgTitle = imgTitle;

    // Handle image if uploaded
    if (req.files && req.files.image) {
      const image = req.files.image[0].filename;
      updateData.image = `/logos/${image}`; // Store relative path to the image

      // Optionally delete the old image
      const existingItem = await Gallary.findById(id);
      if (!existingItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      if (existingItem.image) {
        const oldImagePath = path.join(__dirname, '..', existingItem.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
    }

    // Update the item
    const item = await Gallary.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item updated successfully', data: item });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an item by ID
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Gallary.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};