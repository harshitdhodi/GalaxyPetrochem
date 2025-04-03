const Banner = require('../model/banner');
const mongoose = require('mongoose');
// Create new banner
exports.createBanner = async (req, res) => {
    try {
        const image = req.files['image'] ? req.files['image'][0].filename : null;
        const photo = req.files['photo'] ? req.files['photo'][0].filename : null;
        const banner = new Banner({
            image: image,
            photo: photo,
            imgName: req.body.imgName,
            altName: req.body.altName,
            title: req.body.title,
            details: req.body.details,
            pageSlug: req.body.pageSlug
        });

        const savedBanner = await banner.save();
        res.status(201).json({ message: 'Banner created successfully', banner: savedBanner });
    } catch (err) {
        console.error('Error creating banner:', err);
        res.status(400).json({ message: err.message });
    }
}; 

// Get all banners
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get banner by ID
exports.getBannerById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        console.log("Fetching Banner with ID:", id);

        const banner = await Banner.findById(id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });

        res.status(200).json(banner);
    } catch (err) {
        console.error("Error fetching banner:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// Get banner by pageSlug 
exports.getBannerByPageSlug = async (req, res) => {
    try {
        const { pageSlug } = req.query;

        if (!pageSlug) {
            return res.status(400).json({ message: "pageSlug is required" });
        }

        console.log("Fetching Banner with pageSlug:", pageSlug);

        const banner = await Banner.find({ pageSlug });

        if (!banner || banner.length === 0) {
            return res.status(404).json({ message: "Banner not found" });
        }

        res.status(200).json(banner);
    } catch (err) {
        console.error("Error fetching banner by pageSlug:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update banner
exports.updateBanner = async (req, res) => {
    try {
        const { id } = req.query;
        const existingBanner = await Banner.findById(id);

        if (!existingBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        const updateData = {
            ...req.body
        };

        // Handle image update if new image is uploaded
        if (req.files && req.files['image']) {
            updateData.image = req.files['image'][0].filename;
        }

        if (req.files && req.files['photo']) {
            updateData.photo = req.files['photo'][0].filename;
        }
        const updatedBanner = await Banner.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedBanner);
    } catch (err) {
        console.error('Error updating banner:', err);
        res.status(400).json({ message: err.message });
    }
};

// Delete banner
exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.query;
        const banner = await Banner.findById(id);
        
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        await Banner.findByIdAndDelete(id);
        res.status(200).json({ message: "Banner deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while deleting the banner" });
    }
};
