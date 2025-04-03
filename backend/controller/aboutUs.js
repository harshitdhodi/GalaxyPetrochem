const AboutUs = require('../model/aboutUs');
const fs = require('fs');
const path = require('path');

// Helper function to generate slug
const generateSlug = (section) => {
    return section.toLowerCase().replace(/\s+/g, '-');
};

// Create about us
const createAboutUs = async (req, res) => {
    try {
        const { title, shortDescription, description, imageTitle, altName, section } = req.body;
        const image = req.files?.image?.[0]?.filename;

        if (!title || !description || !shortDescription || !section) {
            return res.status(400).json({ error: 'Title, short description, description, and section are required' });
        }

        if (!image) {
            return res.status(400).json({ error: 'Image is required' });
        }

        // Generate slug from section
        const slug = generateSlug(section);

        // Check if slug already exists
        const existingSlug = await AboutUs.findOne({ slug });
        if (existingSlug) {
            return res.status(400).json({ error: 'Section already exists' });
        }
 
        const aboutUs = new AboutUs({
            title,
            shortDescription,
            description,
            image,
            imageTitle,
            altName,
            section,
            slug,
        });

        await aboutUs.save();
        res.status(201).json({ message: 'About us created successfully', aboutUs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all about us entries
const getAboutUs = async (req, res) => {
    try {
        const query = req.query;
        const aboutUs = await AboutUs.find(query);
        if (!aboutUs.length) {
            return res.status(404).json({ error: 'No about us entries found' });
        }
        res.json(aboutUs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// New: Get about us by ID
const getAboutUsById = async (req, res) => {
    try {
        const { id } = req.query;
        const aboutUs = await AboutUs.findById(id);
        if (!aboutUs) {
            return res.status(404).json({ error: 'About us entry not found' });
        }
        res.json(aboutUs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update about us with ID
const updateAboutUs = async (req, res) => {
    try {
        const { id } = req.query;
        const { title, shortDescription, description, imageTitle, altName, section } = req.body;
        
        // Generate new slug if section is being updated
        const slug = generateSlug(section);

        // Check if new slug already exists (excluding current document)
        const existingSlug = await AboutUs.findOne({ slug, _id: { $ne: id } });
        if (existingSlug) {
            return res.status(400).json({ error: 'Section already exists' });
        }

        const updateData = { 
            title, 
            shortDescription, 
            description, 
            imageTitle, 
            altName, 
            section,
            slug,
        };

        // Handle image update
        if (req.files?.image?.[0]) {
            const oldAboutUs = await AboutUs.findById(id);
            if (oldAboutUs?.image) {
                const imagePath = path.join('uploads', 'images', oldAboutUs.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            updateData.image = req.files.image[0].filename;
        }

        const aboutUs = await AboutUs.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!aboutUs) {
            return res.status(404).json({ error: 'About us entry not found' });
        }

        res.json({ message: 'About us updated successfully', aboutUs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete about us with ID
const deleteAboutUs = async (req, res) => {
    try {
        const { id } = req.query;
        const aboutUs = await AboutUs.findById(id);
        if (!aboutUs) {
            return res.status(404).json({ error: 'About us entry not found' });
        }

        if (aboutUs.image) {
            const imagePath = path.join('uploads', 'images', aboutUs.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await AboutUs.findByIdAndDelete(id);
        res.json({ message: 'About us deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get about us by slug
const getAboutUsBySlug = async (req, res) => {
    try {
        const { slug } = req.query;
        const aboutUs = await AboutUs.findOne({ slug });
        if (!aboutUs) {
            return res.status(404).json({ error: 'About us entry not found' });
        }
        res.json(aboutUs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export all functions
module.exports = {
    createAboutUs,
    getAboutUs,
    getAboutUsById,
    updateAboutUs,
    deleteAboutUs,
    getAboutUsBySlug,
};
