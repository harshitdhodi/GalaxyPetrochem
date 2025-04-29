// models/Testimonial.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  photo: { type: String, required: true },
  altName: { type: String },
  imgTitle: { type: String },
  name: { type: String, required: true },
  designation: { type: String },
  company: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  message: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
