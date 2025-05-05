// models/Stats.js
const mongoose = require('mongoose');

const AboutUs = new mongoose.Schema({
  years: {
    type: Number,
    required: true,
  },
  clients: {
    type: Number,
    required: true,
  },
  experts: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // Store image URL or filename
    required: true,
  },
  imgTitle: {
    type: String,
    required: true,
  },
  altName: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('AboutUs', AboutUs);
