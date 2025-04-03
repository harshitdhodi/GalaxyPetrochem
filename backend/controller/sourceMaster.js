const Source = require('../model/sourceMaster');

// Create a new entry
exports.createsource = async (req, res) => {

    try {
        const { source } = req.body;
        if (!source) {
            return res.status(400).json({ message: 'source is required' });
        }
        const newsource = new Source({ source });
        await newsource.save();
        res.status(201).json({ message: 'source created successfully', data: newsource });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all entries
exports.getAllsources = async (req, res) => {
    try {
        const sources = await Source.find();
        res.status(200).json({ message: 'sources fetched successfully', data: sources });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single entry by ID
exports.getsourceById = async (req, res) => {
    try {
        const { id } = req.query;
        const source = await Source.findById(id);
        if (!source) {
            return res.status(404).json({ message: 'source not found' });
        }
        res.status(200).json({ message: 'source fetched successfully', data: source });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an entry by ID
exports.updatesourceById = async (req, res) => {
    try {
        const { id } = req.query;
        const { source } = req.body;
        const updatedsource = await Source.findByIdAndUpdate(id, { source }, { new: true });
        if (!updatedsource) {
            return res.status(404).json({ message: 'source not found' });
        }
        res.status(200).json({ message: 'source updated successfully', data: updatedsource });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an entry by ID
exports.deletesourceById = async (req, res) => {
    try {
        const { id } = req.query;
        const deletedsource = await Source.findByIdAndDelete(id);
        if (!deletedsource) {
            return res.status(404).json({ message: 'source not found' });
        }
        res.status(200).json({ message: 'source deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
