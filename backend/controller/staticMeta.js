const Meta = require('../model/staticMeta');

// Create a new meta
exports.createMeta = async (req, res) => {
    try {
        const { pageName, metaTitle,pageSlug, metaDescription, metaKeyword } = req.body;
        const newMeta = new Meta({ pageName, metaTitle, metaDescription, metaKeyword,pageSlug });
        await newMeta.save();
        res.status(201).json({ success: true, data: newMeta });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all metas
exports.getAllMetas = async (req, res) => {
    try {
        const metas = await Meta.find();
        res.status(200).json({ success: true, data: metas });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single meta by ID
exports.getMetaById = async (req, res) => {
    try {
        const meta = await Meta.findById(req.params.id);
        if (!meta) {
            return res.status(404).json({ success: false, message: 'Meta not found' });
        }
        res.status(200).json({ success: true, data: meta });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a meta by ID
exports.updateMeta = async (req, res) => {
    try {
        const { pageName, metaTitle, metaDescription,pageSlug, metaKeyword } = req.body;
        const updatedMeta = await Meta.findByIdAndUpdate(
            req.params.id,
            { pageName, metaTitle, metaDescription, metaKeyword ,pageSlug},
            { new: true, runValidators: true }
        );
        if (!updatedMeta) {
            return res.status(404).json({ success: false, message: 'Meta not found' });
        }
        res.status(200).json({ success: true, data: updatedMeta });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a meta by ID
exports.deleteMeta = async (req, res) => {
    try {
        const deletedMeta = await Meta.findByIdAndDelete(req.params.id);
        if (!deletedMeta) {
            return res.status(404).json({ success: false, message: 'Meta not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};