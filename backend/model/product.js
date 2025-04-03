const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ChemicalCategory", required: true },
  categorySlug: { type: String, required: true },
  slug: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{
    url: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }],
  table: { type: String },
  details: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeyword: { type: String },
  metaSchema: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
