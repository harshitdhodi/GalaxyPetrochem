// models/Brand.js
const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String } // store filename or path
}, { timestamps: true });

module.exports = mongoose.model('brand', BrandSchema);
