const Catalogue = require('../model/catalogue');

// Create a new catalogue
const createCatalogue = async (req, res) => {
  try {
    const { title } = req.body;

    // Check if a catalog file was uploaded
    if (!req.files || !req.files.catalog || req.files.catalog.length === 0) {
      return res.status(400).json({ error: "No catalog file uploaded" });
    }

    // Check if an image file was uploaded
    if (!req.files.image || req.files.image.length === 0) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const catalog = req.files.catalog[0].filename;
    const image = req.files.image[0].filename;

    const newCatalogue = new Catalogue({ title, catalogue: catalog, image });

    await newCatalogue.save();

    res.status(201).json(newCatalogue);
  } catch (error) {
    res.status(500).json({ error: "Failed to create catalogue", details: error.message });
  }
};

// Get all catalogues
const getAllCatalogues = async (req, res) => {
  try {
    const catalogues = await Catalogue.find();
    res.status(200).json(catalogues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch catalogues', details: error.message });
  }
};

// Get a single catalogue by ID
const getCatalogueById = async (req, res) => {
  try {
    const catalogue = await Catalogue.findById(req.params.id);
    if (!catalogue) {
      return res.status(404).json({ error: 'Catalogue not found' });
    }
    res.status(200).json(catalogue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch catalogue', details: error.message });
  }
};

// Update a catalogue by ID
const updateCatalogue = async (req, res) => {
  try {
    const { title } = req.body;
    const catalog = req.files.catalog ? req.files.catalog[0].filename : undefined;
    const image = req.files.image ? req.files.image[0].filename : undefined;
    const updateData = { title };
    if (catalog) updateData.catalogue = catalog;
    if (image) updateData.image = image;
    const updatedCatalogue = await Catalogue.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedCatalogue) {
      return res.status(404).json({ error: 'Catalogue not found' });
    }
    res.status(200).json(updatedCatalogue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update catalogue', details: error.message });
  }
};

// Delete a catalogue by ID
const deleteCatalogue = async (req, res) => {
  try {
    const catalogue = await Catalogue.findByIdAndDelete(req.params.id);
    if (!catalogue) {
      return res.status(404).json({ error: 'Catalogue not found' });
    }
    res.status(200).json({ message: 'Catalogue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete catalogue', details: error.message });
  }
};

module.exports = {
  createCatalogue,
  getAllCatalogues,
  getCatalogueById,
  updateCatalogue,
  deleteCatalogue,
};