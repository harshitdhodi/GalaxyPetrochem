const mongoose = require('mongoose');

// Chemical Schema
const chemicalSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ChemicalCategory' },
    categorySlug: { type: String, default: "", required: true },  // Add categorySlug field
    sub_category: { type: mongoose.Schema.Types.ObjectId, ref: 'ChemicalCategory', required: false, default: undefined },
    subCategorySlug: { type: String, default: "", required: false },  // Add subCategorySlug field
    subsub_category_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ChemicalCategory',
        required: false, 
        default: undefined  
    },
    subSubCategorySlug: { type: String, default: "", required: false },  // Add subSubCategorySlug field
    name: { type: String, default: "" },
    slug: { type: String, default: "" },
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
    catalog: { type: String, default: "" },
    msds: { type: String, default: "" },
    specs: { type: String, default: "" },
    table:{type:String , default:""},
    description: { type: String, default: "" },
    global_tagline: { type: String, default: "" },
      
    synonyms: [{ type: String, default: "" }],
    application: [{ type: String, default: "" }],
  
    product_code: { type: String, default: "" },
    auto_p_code: { type: String, unique: true, default: "" },
    
    metatitle: { type: String, default: "" },
    metadescription: { type: String, default: "" },
    metakeywords: { type: String, default: "" },
    metacanonical: { type: String, default: "" },
    metalanguage: { type: String, default: "" },
    metaschema: { type: String, default: "" },
    otherMeta: { type: String, default: "" },
}, { timestamps: true });

// Pre-save middleware to generate unique Auto_p_code
chemicalSchema.pre('save', async function (next) {
    // If Auto_p_code is not set, generate it
    if (!this.auto_p_code || this.auto_p_code === "") {
        const randomCode = Math.floor(100000 + Math.random() * 900000);  // Generate a random 6-digit number
        this.auto_p_code = randomCode.toString();
    }
    next();
});

// Create and export the model
module.exports = mongoose.model('Chemical', chemicalSchema);
