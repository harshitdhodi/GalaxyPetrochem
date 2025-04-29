// models/ExpertiseContent.js

const mongoose = require('mongoose');

const ExpertiseContentSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    subHeading: {
      type: String,
      required: true,
      trim: true,
    },
    missionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    missionDescription: {
      type: String,
      required: true,
      trim: true,
    },
    visionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    visionDescription: {
      type: String,
      required: true,
      trim: true,
    },
    missionPoints: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    visionPoints: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true, // this will automatically add createdAt and updatedAt
  }
);

// Export the model
module.exports = mongoose.model('ExpertiseContent', ExpertiseContentSchema);
