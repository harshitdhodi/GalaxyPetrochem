const Sitemap = require('../model/sitemap');

// Get all sitemaps
const getAllSitemaps = async (req, res) => {
    try {
        const sitemaps = await Sitemap.find({})
            .sort({ timestamp: -1 }); // Sort by timestamp in descending order (newest first)
        
        res.status(200).json({
            success: true,
            count: sitemaps.length,
            data: sitemaps
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

module.exports = {
    getAllSitemaps
};