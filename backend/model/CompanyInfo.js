const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  brand: { type: String, required: true },
  photo: { type: String }, // filename of uploaded image
  altName: { type: String }, // NEW
  imgTitle: { type: String }, // NEW
  year: { type: Number, required: true },
  experts: { type: Number, required: true },
  details: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
