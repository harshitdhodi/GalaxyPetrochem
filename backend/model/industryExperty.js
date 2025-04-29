const mongoose = require('mongoose');

const IndustryExperties = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  subHeading: {
    type: String,
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
}, { timestamps: true });

const IndustryExperty = mongoose.model('IndustryExperties', IndustryExperties);

module.exports = IndustryExperty;