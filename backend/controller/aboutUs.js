const Stats = require('../model/aboutUs');
const path = require('path');

// Create Stats
exports.createStats = async (req, res) => {
  try {
    const { years, clients, experts, details, imgTitle, altName } = req.body;

    const photo = req.files?.photo?.[0]?.filename || '';

    const newStats = new Stats({
      years,
      clients,
      experts,
      details,
      photo,
      imgTitle,
      altName
    });

    await newStats.save();
    res.status(201).json({ message: 'Stats created successfully', data: newStats });
  } catch (err) {
    console.error('Error creating stats:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Get All Stats
exports.getAllStats = async (req, res) => {
  try {
    const stats = await Stats.find();
    res.status(200).json({ message: 'Stats fetched successfully', data: stats });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Get Stats by ID
exports.getStatsById = async (req, res) => {
  try {
    const stats = await Stats.findById(req.params.id);
    if (!stats) return res.status(404).json({ error: 'Stats not found' });
    res.status(200).json({ message: 'Stats fetched successfully', data: stats });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

exports.updateStats = async (req, res) => {
    try {
      const { years, clients, experts, details, imgTitle, altName } = req.body;
  
      const photo = req.files?.photo?.[0]?.filename || undefined;
  
      const updateData = {
        years,
        clients,
        experts,
        details,
        imgTitle,
        altName,
      };
  
      if (photo) {
        updateData.photo = photo;
      }
  
      const updatedStats = await Stats.findOneAndUpdate({}, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedStats) {
        return res.status(404).json({ error: 'Stats not found' });
      }
  
      res.status(200).json({ message: 'Stats updated successfully', data: updatedStats });
    } catch (err) {
      console.error('Error updating stats:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  };
  
// Delete Stats
exports.deleteStats = async (req, res) => {
  try {
    const stats = await Stats.findByIdAndDelete(req.params.id);
    if (!stats) return res.status(404).json({ error: 'Stats not found' });
    res.status(200).json({ message: 'Stats deleted successfully' });
  } catch (err) {
    console.error('Error deleting stats:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
