const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  category: { type: String, required: true },
  slug: { type: String, required: true },
  metatitle: { type: String },
  metadescription: { type: String },
  metakeywords: { type: String },
  metacanonical: { type: String },
  metalanguage: { type: String },
  metaschema: { type: String },
  otherMeta: { type: String },
  url: { type: String },
  priority: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a compound index for category and slug
BlogSchema.index({ category: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('BlogCategory', BlogSchema);
