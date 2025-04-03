const Privacy = require('../model/privacy');
const express = require('express');
const app = express();

// Increase payload limit
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Create a new privacy document
const createPrivacy = async (req, res) => {
  try {
    const { privacyPolicy } = req.body;
    const newPrivacy = new Privacy({ privacyPolicy });
    await newPrivacy.save();
    res.status(201).json(newPrivacy);
  } catch (error) {
    res.status(500).json({ error: "Failed to create privacy document", details: error.message });
  }
};

// Get all privacy documents
const getAllPrivacy = async (req, res) => {
  try {
    const privacyDocs = await Privacy.find();
    res.status(200).json(privacyDocs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch privacy documents', details: error.message });
  }
};

// Get a single privacy document by ID
const getPrivacyById = async (req, res) => {
  try {
    const privacyDoc = await Privacy.findById(req.params.id);
    if (!privacyDoc) {
      return res.status(404).json({ error: 'Privacy document not found' });
    }
    res.status(200).json(privacyDoc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch privacy document', details: error.message });
  }
};

// Update a privacy document by ID
const updatePrivacy = async (req, res) => {
  try {
    const { privacyPolicy } = req.body;
    const updatedPrivacy = await Privacy.findByIdAndUpdate(
      req.params.id,
      { privacyPolicy },
      { new: true }
    );
    if (!updatedPrivacy) {
      return res.status(404).json({ error: 'Privacy document not found' });
    }
    res.status(200).json(updatedPrivacy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update privacy document', details: error.message });
  }
};

// Delete a privacy document by ID
const deletePrivacy = async (req, res) => {
  try {
    const privacyDoc = await Privacy.findByIdAndDelete(req.params.id);
    if (!privacyDoc) {
      return res.status(404).json({ error: 'Privacy document not found' });
    }
    res.status(200).json({ message: 'Privacy document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete privacy document', details: error.message });
  }
};

module.exports = {
  createPrivacy,
  getAllPrivacy,
  getPrivacyById,
  updatePrivacy,
  deletePrivacy,
};