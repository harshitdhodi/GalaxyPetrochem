const Name = require('../model/chemicalType');

// Create a new name
exports.createName = async (req, res) => {
  try {
    const { name } = req.body;
    const newName = new Name({ name });
    await newName.save();
    res.status(201).json({ message: 'Name created successfully', data: newName });
  } catch (error) {
    res.status(500).json({ error: 'Error creating name' });
  }
};

// Read all names
exports.getAllNames = async (req, res) => {
  try {
    const names = await Name.find();
    res.status(200).json(names);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching names' });
  }
};

// Read a single name by ID
exports.getNameById = async (req, res) => {
  try {
    const { id } = req.query;
    const name = await Name.findById(id);
    if (!name) return res.status(404).json({ error: 'Name not found' });
    res.status(200).json(name);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching name' });
  }
};

// Update a name by ID
exports.updateName = async (req, res) => {
  try {
    const { id } = req.query;
    const { name } = req.body;
    const updatedName = await Name.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedName) return res.status(404).json({ error: 'Name not found' });
    res.status(200).json({ message: 'Name updated successfully', data: updatedName });
  } catch (error) {
    res.status(500).json({ error: 'Error updating name' });
  }
};

// Delete a name by ID
exports.deleteName = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedName = await Name.findByIdAndDelete(id);
    if (!deletedName) return res.status(404).json({ error: 'Name not found' });
    res.status(200).json({ message: 'Name deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting name' });
  }
};
