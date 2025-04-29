const ExpertiseContent = require('../model/missionVision');

// CREATE new Expertise Content
exports.createExpertiseContent = async (req, res) => {
  try {
    const newContent = new ExpertiseContent(req.body);
    const savedContent = await newContent.save();
    res.status(201).json({
      message: 'Expertise Content created successfully',
      data: savedContent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating content', error: error.message });
  }
};

// READ all Expertise Content
exports.getAllExpertiseContent = async (req, res) => {
  try {
    const content = await ExpertiseContent.find();
    res.status(200).json({
      message: 'Expertise Content fetched successfully',
      data: content,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content', error: error.message });
  }
};

// READ single Expertise Content by ID
exports.getExpertiseContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await ExpertiseContent.findById(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json({
      message: 'Expertise Content fetched successfully',
      data: content,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content', error: error.message });
  }
};

// UPDATE Expertise Content by ID
exports.updateExpertiseContent = async (req, res) => {
    try {
      const updatedContent = await ExpertiseContent.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedContent) {
        return res.status(404).json({ message: 'Content not found' });
      }
  
      res.status(200).json({
        message: 'Expertise Content updated successfully',
        data: updatedContent,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating content', error: error.message });
    }
  };

// DELETE Expertise Content by ID
exports.deleteExpertiseContent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContent = await ExpertiseContent.findByIdAndDelete(id);

    if (!deletedContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json({ message: 'Expertise Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content', error: error.message });
  }
};

exports.deleteSpecificPoint = async (req, res) => {
    try {
      const { type, point } = req.body; // `type` can be 'missionPoints' or 'visionPoints', and `point` is the value to remove.
  
      if (!['missionPoints', 'visionPoints'].includes(type)) {
        return res.status(400).json({ message: 'Invalid type. Use "missionPoints" or "visionPoints".' });
      }
  
      const updatedContent = await ExpertiseContent.findOneAndUpdate(
        {}, // Assuming there's only one document
        { $pull: { [type]: point } }, // Dynamically remove the specified point
        { new: true, runValidators: true }
      );
  
      if (!updatedContent) {
        return res.status(404).json({ message: 'Content not found' });
      }
  
      res.status(200).json({
        message: `Point removed successfully from ${type}`,
        data: updatedContent,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error removing point', error: error.message });
    }
  };