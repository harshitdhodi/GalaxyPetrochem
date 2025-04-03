const Status = require('../model/statusMaster');

// Create a new entry
exports.createstatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'status is required' });
        }
        const newstatus = new Status({ status });
        await newstatus.save();
        res.status(201).json({ message: 'status created successfully', data: newstatus });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all entries
exports.getAllstatuss = async (req, res) => {
    try {
        const statuss = await Status.find();
        res.status(200).json({ message: 'statuss fetched successfully', data: statuss });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single entry by ID
exports.getstatusById = async (req, res) => {
    try {
        const { id } = req.query;
        const status = await Status.findById(id);
        if (!status) {
            return res.status(404).json({ message: 'status not found' });
        }
        res.status(200).json({ message: 'status fetched successfully', data: status });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an entry by ID
exports.updatestatusById = async (req, res) => {
    try {
        const { id } = req.query;
        const { status } = req.body;
        const updatedstatus = await Status.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedstatus) {
            return res.status(404).json({ message: 'status not found' });
        }
        res.status(200).json({ message: 'status updated successfully', data: updatedstatus });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an entry by ID
exports.deletestatusById = async (req, res) => {
    try {
        const { id } = req.query;
        const deletedstatus = await Status.findByIdAndDelete(id);
        if (!deletedstatus) {
            return res.status(404).json({ message: 'status not found' });
        }
        res.status(200).json({ message: 'status deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
