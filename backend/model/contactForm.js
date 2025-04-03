const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  organisation: {
    type: String,
    required: true,
  },
  department: String,
  address: String,
  country: String,
  phone: String,
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  needCallback: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Contact', contactSchema);