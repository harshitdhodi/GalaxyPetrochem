// models/Server.js
const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  host: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isSSL: {
    type: Boolean,
    default: false
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('smtp_setting', serverSchema);
