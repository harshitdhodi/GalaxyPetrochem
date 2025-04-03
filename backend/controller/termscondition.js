const TermsCondition = require('../model/termscondition');

// Create a new terms and conditions document
const createTermsCondition = async (req, res) => {
  try {
    const { termsCondition } = req.body;
    const newTermsCondition = new TermsCondition({ termsCondition });
    await newTermsCondition.save();
    res.status(201).json(newTermsCondition);
  } catch (error) {
    res.status(500).json({ error: "Failed to create terms and conditions document", details: error.message });
  }
};

// Get all terms and conditions documents
const getAllTermsCondition = async (req, res) => {
  try {
    const termsConditionDocs = await TermsCondition.find();
    res.status(200).json(termsConditionDocs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch terms and conditions documents', details: error.message });
  }
};

// Get a single terms and conditions document by ID
const getTermsConditionById = async (req, res) => {
  try {
    const termsConditionDoc = await TermsCondition.findById(req.params.id);
    if (!termsConditionDoc) {
      return res.status(404).json({ error: 'Terms and conditions document not found' });
    }
    res.status(200).json(termsConditionDoc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch terms and conditions document', details: error.message });
  }
};

// Update a terms and conditions document by ID
const updateTermsCondition = async (req, res) => {
  try {
    const { termsCondition } = req.body;
    const updatedTermsCondition = await TermsCondition.findByIdAndUpdate(req.params.id, { termsCondition }, { new: true });
    if (!updatedTermsCondition) {
      return res.status(404).json({ error: 'Terms and conditions document not found' });
    }
    res.status(200).json(updatedTermsCondition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update terms and conditions document', details: error.message });
  }
};

// Delete a terms and conditions document by ID
const deleteTermsCondition = async (req, res) => {
  try {
    const termsConditionDoc = await TermsCondition.findByIdAndDelete(req.params.id);
    if (!termsConditionDoc) {
      return res.status(404).json({ error: 'Terms and conditions document not found' });
    }
    res.status(200).json({ message: 'Terms and conditions document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete terms and conditions document', details: error.message });
  }
};

module.exports = {
  createTermsCondition,
  getAllTermsCondition,
  getTermsConditionById,
  updateTermsCondition,
  deleteTermsCondition,
};