const Logo = require('../model/Logo');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// Add new logo
const addLogo = async (req, res) => {
    try {
        if (!req.files || !req.files.headerLogo || !req.files.favIcon) {
            return res.status(400).json({ success: false, message: 'Both headerLogo and favIcon are required' });
        }

        // Check if a logo already exists
        const existingLogo = await Logo.findOne();
        if (existingLogo) {
            return res.status(400).json({ success: false, message: 'Logo already exists. Use update instead.' });
        }

        // Create a new logo record
        const logo = await Logo.create({
            headerLogo: req.files.headerLogo[0].filename,
            headerLogoName: req.body.headerLogoName || '',
            headerLogoAltName: req.body.headerLogoAltName || '',
            favIcon: req.files.favIcon[0].filename,
            favIconName: req.body.favIconName || '',
            favIconAltName: req.body.favIconAltName || ''
        });

        res.status(201).json({ success: true, data: logo, message: 'Logo added successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update logo
const updateLogo = async (req, res) => {
    try {
        let logo = await Logo.findOne();
        if (!logo) return res.status(404).json({ success: false, message: 'Logo not found' });

        // Store old values before updating
        const updatedLogo = {
            headerLogo: req.files?.headerLogo ? req.files.headerLogo[0].filename : logo.headerLogo,
            favIcon: req.files?.favIcon ? req.files.favIcon[0].filename : logo.favIcon,
            headerLogoName: req.body.headerLogoName ?? logo.headerLogoName,
            headerLogoAltName: req.body.headerLogoAltName ?? logo.headerLogoAltName,
            favIconName: req.body.favIconName ?? logo.favIconName,
            favIconAltName: req.body.favIconAltName ?? logo.favIconAltName
        };

        // Update database
        Object.assign(logo, updatedLogo);
        await logo.save();

        res.status(200).json({ success: true, data: updatedLogo, message: 'Logo updated successfully' });

    } catch (error) {
        console.error("Error updating logo:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// Get logo
const getLogo = async (req, res) => {
    try {
        const logo = await Logo.findOne().lean();
        if (!logo) return res.status(404).json({ success: false, message: "Logo not found" });

        // Disable caching in response headers
        res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.set("Pragma", "no-cache");
        res.set("Expires", "0");

        res.status(200).json({ success: true, data: logo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete logo
const deleteLogo = async (req, res) => {
    try {
        const logo = await Logo.findOneAndDelete();
        if (!logo) return res.status(404).json({ success: false, message: 'Logo not found' });

        // Delete associated files
        const deleteFile = (filePath) => {
            const fullPath = path.join(__dirname, '..', 'uploads', 'logos', filePath);
            if (fs.existsSync(fullPath)) fs.unlink(fullPath, (err) => console.error(`Error deleting file:`, err));
        };

        deleteFile(logo.headerLogo);
        deleteFile(logo.favIcon);

        res.status(200).json({ success: true, message: 'Logo deleted successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addLogo,
    updateLogo,
    getLogo,
    deleteLogo
    
};
