
// models/Item.js - Mongoose Model
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true  
  },
  altName: {
    type: String,
    required: true,
    trim: true
  },
  imgTitle: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gallary', itemSchema);