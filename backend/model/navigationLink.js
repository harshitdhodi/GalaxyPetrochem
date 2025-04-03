const mongoose = require('mongoose');

const navigationLinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const NavigationLink = mongoose.model('NavigationLink', navigationLinkSchema);

module.exports = NavigationLink;