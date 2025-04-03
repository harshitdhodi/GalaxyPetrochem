const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Image = require('../model/slideShow');
const { uploadDir, singleImage } = require('../middleware/singleImage');

// Upload and save image
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { altText, title } = req.body;
        if (!altText || !title) {
            return res.status(400).json({ error: 'Alt text and title are required' });
        }

        const image = req.file.filename;

        // Save image details to MongoDB
        const newImage = new Image({ image, altText, title });
        await newImage.save();

        res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Get all images
const getAllImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Get single image by ID
const getImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.query.id);
        if (!image) return res.status(404).json({ error: 'Image not found' });

        res.status(200).json(image);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Update image details
const updateImage = async (req, res) => {
    try {
        const { altText, title } = req.body;
        const updatedData = { altText, title };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        const updatedImage = await Image.findByIdAndUpdate(req.query.id, updatedData, { new: true });
        if (!updatedImage) return res.status(404).json({ error: 'Image not found' });

        res.status(200).json({ message: 'Image updated successfully', image: updatedImage });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Delete image
const deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.query.id);
        if (!image) return res.status(404).json({ error: 'Image not found' });

        // Delete image file
        const filePath = path.join(uploadDir, image.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Image.findByIdAndDelete(req.query.id);
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

module.exports = { uploadImage, getAllImages, getImageById, updateImage, deleteImage };
