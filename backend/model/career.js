const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  postAppliedFor: {
    type: String,
    required: true,
  },
  resumeFile: {
    type: String, // This will store the file path
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create model
const Career = mongoose.model('Career', careerSchema);

module.exports = Career;
