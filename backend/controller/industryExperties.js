const IndustryExperty = require('../model/industryExperty'); // Import the IndustryExperty model
const asyncHandler = require('express-async-handler');

const createIndustryExperty = async (req, res) => {
    try {
      const { heading, subHeading, items } = req.body;
  
      // Validate input
      if (!heading || !subHeading || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Please provide heading, subHeading, and at least one item with name and description' });
      }
  
      // Validate each item
      for (const item of items) {
        if (!item.name || !item.description) {
          return res.status(400).json({ message: 'Each item must have a name and description' });
        }
      }
  
      const industryExperty = await IndustryExperty.create({
        heading,
        subHeading,
        items,
      });
  
      res.status(201).json(industryExperty);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error while creating industry expertise' });
    }
  };
  

const getIndustryExperties = asyncHandler(async (req, res) => {
  const industryExperties = await IndustryExperty.find();
  res.status(200).json(industryExperties);
});

// @desc    Get a single industry expertise by ID
// @route   GET /api/industry-experties/:id
// @access  Public
const getIndustryExpertyById = asyncHandler(async (req, res) => {
  const industryExperty = await IndustryExperty.findById(req.params.id);

  if (!industryExperty) {
    res.status(404);
    throw new Error('Industry expertise not found');
  }

  res.status(200).json(industryExperty);
});

// @desc    Update an industry expertise
// @route   PUT /api/industry-experties/:id
// @access  Private
const updateIndustryExperty = asyncHandler(async (req, res) => {
  const { heading, subHeading, items } = req.body;

  const industryExperty = await IndustryExperty.findById(req.params.id);

  if (!industryExperty) {
    res.status(404);
    throw new Error('Industry expertise not found');
  }

  // Validate input if provided
  if (items && (!Array.isArray(items) || items.length === 0)) {
    res.status(400);
    throw new Error('Items must be a non-empty array');
  }

  if (items) {
    for (const item of items) {
      if (!item.name || !item.description) {
        res.status(400);
        throw new Error('Each item must have a name and description');
      }
    }
  }

  // Update fields
  industryExperty.heading = heading || industryExperty.heading;
  industryExperty.subHeading = subHeading || industryExperty.subHeading;
  industryExperty.items = items || industryExperty.items;

  const updatedIndustryExperty = await industryExperty.save();
  res.status(200).json(updatedIndustryExperty);
});

// @desc    Delete an industry expertise
// @route   DELETE /api/industry-experties/:id
// @access  Private
const deleteIndustryExperty = asyncHandler(async (req, res) => {
  const industryExperty = await IndustryExperty.findById(req.params.id);

  if (!industryExperty) {
    res.status(404);
    throw new Error('Industry expertise not found');
  }

  await industryExperty.remove();
  res.status(200).json({ message: 'Industry expertise deleted successfully' });
});

module.exports = {
  createIndustryExperty,
  getIndustryExperties,
  getIndustryExpertyById,
  updateIndustryExperty,
  deleteIndustryExperty,
};