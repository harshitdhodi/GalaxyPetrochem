// models/Brand.js
const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // unique slug for SEO-friendly URLs
  photo: { type: String } // store filename or path
}, { timestamps: true });

module.exports = mongoose.model('brand', BrandSchema);
