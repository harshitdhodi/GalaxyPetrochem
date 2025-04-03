const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  cc_email: { type: [String], default: [] },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  attachment: { type: String }, // Store the file path or name
}, { timestamps: true });

module.exports = mongoose.model('Email', emailSchema);
