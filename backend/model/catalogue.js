const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  catalogue: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Catalogue = mongoose.model('Catalogue', catalogueSchema);

module.exports = Catalogue; 