const Unit = require('../model/unit'); // Assuming you have a unit model

// Create a new unit
exports.createUnit = async (req, res) => {
    try {
        const { name } = req.body; // Assuming you are sending the name in the body
        const newUnit = new Unit({ name });
        await newUnit.save();
        res.status(201).json({ message: 'Unit created successfully', data: newUnit });
    } catch (error) {
        res.status(500).json({ error: 'Error creating unit' });
    }
};

// Read all units
exports.getAllUnits = async (req, res) => {
    try {
        const units = await Unit.find();
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching units' });
    }
};

// Read a single unit by ID
exports.getUnitById = async (req, res) => {
    try {
        const { id } = req.query;
        const unit = await Unit.findById(id);
        if (!unit) return res.status(404).json({ error: 'Unit not found' });
        res.status(200).json(unit);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching unit' });
    }
};

// Update a unit by ID
exports.updateUnit = async (req, res) => {
    try {
        const { id } = req.query;
        const { name } = req.body;
        console.log("Received update request:", { id, name }); // Add this log to check the request payload
        const updatedUnit = await Unit.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedUnit) return res.status(404).json({ error: 'Unit not found' });
        res.status(200).json({ message: 'Unit updated successfully', data: updatedUnit });
    } catch (error) {
        res.status(500).json({ error: 'Error updating unit' });
    }
};

// Delete a unit by ID
exports.deleteUnit = async (req, res) => {
    try {
        const { id } = req.query;
        const deletedUnit = await Unit.findByIdAndDelete(id);
        if (!deletedUnit) return res.status(404).json({ error: 'Unit not found' });
        res.status(200).json({ message: 'Unit deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting unit' });
    }
};
