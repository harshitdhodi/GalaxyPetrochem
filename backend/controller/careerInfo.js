const CareerInfo = require('../model/careerInfo');

// Get all career info
exports.getAllCareerInfo = async (req, res) => {
  try {
    const careerInfo = await CareerInfo.find();
    res.status(200).json(careerInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get career info by ID
exports.getCareerInfoById = async (req, res) => {
  try {
    const careerInfo = await CareerInfo.findById(req.params.id);
    if (!careerInfo) return res.status(404).json({ message: 'Career info not found' });
    res.status(200).json(careerInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new career info
exports.createCareerInfo = async (req, res) => {
    try {
      const { info } = req.body;
      // Handle multiple file fields from multer .fields()
      const image = req.files && req.files.image ? req.files.image[0].filename : null;
  
      // Validation
      if (!info) {
        return res.status(400).json({ message: 'Career info is required' });
      }
  
      const newCareerInfo = new CareerInfo({ info, image });
      const savedCareerInfo = await newCareerInfo.save();
      
      res.status(201).json(savedCareerInfo);
    } catch (error) {
      console.error('Career info creation error:', error);
      res.status(400).json({ 
        message: 'Failed to create career info',
        error: error.message 
      });
    }
  };

// Update career info by ID
exports.updateCareerInfo = async (req, res) => {
    const { info } = req.body;
    const image = req.files && req.files.image ? req.files.image[0].filename : null;
  
    try {
      const updateFields = {};
      if (info) updateFields.info = info;
      if (image) updateFields.image = image;
  
      const updatedCareerInfo = await CareerInfo.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );
      if (!updatedCareerInfo) return res.status(404).json({ message: 'Career info not found' });
      res.status(200).json(updatedCareerInfo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Delete career info by ID
exports.deleteCareerInfo = async (req, res) => {
  try {
    const deletedCareerInfo = await CareerInfo.findByIdAndDelete(req.params.id);
    if (!deletedCareerInfo) return res.status(404).json({ message: 'Career info not found' });
    res.status(200).json({ message: 'Career info deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};