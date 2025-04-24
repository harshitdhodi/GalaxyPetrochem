const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  categorySlug: { type: String,  },
  subCategorySlug: { type: String,  },
  slug: { type: String,  },
  name: { type: String,  },
  tagline: { type: String },
  specifiction: { type: String },
  details: { type: String },
  tableInfo: { type: String },
  images: [{
    url: {
      type: String,
      
    },
    altText: {
      type: String,
      
    },
    title: {
      type: String,
      
    }
  }],
  pdf: { type: String }, // filename or URL
  msds: { type: String }, // filename or URL
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ChemicalCategory" },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ChemicalCategory" },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeyword: { type: String },
  metaSchema: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("petroChemProduct", ProductSchema);
