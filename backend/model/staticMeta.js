const mongoose = require('mongoose');

const MetaSchema = new mongoose.Schema({
    pageName: { type: String, required: true, unique: true },
    pageSlug:{type:String,required:true,unique:true},
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeyword: { type: String },
});
 
module.exports = mongoose.model('Meta', MetaSchema);
