const mongoose = require('mongoose');

const sitemapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure the name is unique
  },
  timestamp: {
    type: Date,
    default: Date.now, // Set the default timestamp to the current date and time
  },
});

// Middleware to update the timestamp automatically on save
sitemapSchema.pre('save', function (next) {
  this.timestamp = Date.now(); // Update the timestamp before saving
  next();
});

module.exports = mongoose.model('Sitemap', sitemapSchema);