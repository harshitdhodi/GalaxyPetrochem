const WhatsupInfo = require('../model/whatsUpInfo');

// Create a new whatsupInfo
exports.createWhatsupInfo = async (req, res) => {
  try {
    const { message, number } = req.body;
    const newWhatsupInfo = new WhatsupInfo({ message, number });
    await newWhatsupInfo.save();
    res.status(201).json(newWhatsupInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all whatsupInfo
exports.getAllWhatsupInfo = async (req, res) => {
  try {
    const whatsupInfos = await WhatsupInfo.find();
    res.status(200).json(whatsupInfos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single whatsupInfo by ID
exports.getWhatsupInfoById = async (req, res) => {
  try {
    const whatsupInfo = await WhatsupInfo.findById(req.params.id);
    if (!whatsupInfo) {
      return res.status(404).json({ error: 'WhatsupInfo not found' });
    }
    res.status(200).json(whatsupInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a whatsupInfo by ID
exports.updateWhatsupInfoById = async (req, res) => {
  try {
    const { message, number } = req.body;
    const updatedWhatsupInfo = await WhatsupInfo.findByIdAndUpdate(
      req.params.id,
      { message, number },
      { new: true, runValidators: true }
    );
    if (!updatedWhatsupInfo) {
      return res.status(404).json({ error: 'WhatsupInfo not found' });
    }
    res.status(200).json(updatedWhatsupInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a whatsupInfo by ID
exports.deleteWhatsupInfoById = async (req, res) => {
  try {
    const deletedWhatsupInfo = await WhatsupInfo.findByIdAndDelete(req.params.id);
    if (!deletedWhatsupInfo) {
      return res.status(404).json({ error: 'WhatsupInfo not found' });
    }
    res.status(200).json({ message: 'WhatsupInfo deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};