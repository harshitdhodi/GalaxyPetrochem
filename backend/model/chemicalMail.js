const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  recipients: [{
    type: String,
    required: true,
  }],
  chemicalNames: [{
    type: String,
    required: true,
  }],
  sentAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    required: true,
  }
});

module.exports = mongoose.model('chemicalEmail', emailSchema);