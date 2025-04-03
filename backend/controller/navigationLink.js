const NavigationLink = require('../model/navigationLink');

// Create a new navigation link
const createNavigationLink = async (req, res) => {
    try {
      const { name } = req.body;
      // Check if icon was uploaded and processed by middleware
      const icon = req.files && req.files.icon ? req.files.icon[0].filename : null;
  
      if (!icon) {
        return res.status(400).json({ error: 'Icon file is required' });
      }
  
      const newLink = new NavigationLink({ name, icon });
      await newLink.save();
      res.status(201).json(newLink);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create navigation link' });
    }
  };

// Get all navigation links
const getAllNavigationLinks = async (req, res) => {
  try {
    const links = await NavigationLink.find();
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch navigation links', details: error.message });
  }
};

// Get a single navigation link by ID
const getNavigationLinkById = async (req, res) => {
  try {
    const link = await NavigationLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ error: 'Navigation link not found' });
    }
    res.status(200).json(link);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch navigation link', details: error.message });
  }
};

// Update a navigation link by ID
const updateNavigationLink = async (req, res) => {
  try {
    const { name } = req.body;
    const icon = req.files && req.files.icon ? req.files.icon[0].filename : null;
  
    const link = await NavigationLink.findByIdAndUpdate(req.params.id, { name, icon }, { new: true });
    if (!link) {
      return res.status(404).json({ error: 'Navigation link not found' });
    }
    res.status(200).json(link);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update navigation link', details: error.message });
  }
};

// Delete a navigation link by ID
const deleteNavigationLink = async (req, res) => {
  try {
    const link = await NavigationLink.findByIdAndDelete(req.params.id);
    if (!link) {
      return res.status(404).json({ error: 'Navigation link not found' });
    }
    res.status(200).json({ message: 'Navigation link deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete navigation link', details: error.message });
  }
};

module.exports = {
  createNavigationLink,
  getAllNavigationLinks,
  getNavigationLinkById,
  updateNavigationLink,
  deleteNavigationLink,
};