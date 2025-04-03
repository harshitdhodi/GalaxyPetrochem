// /models/contactModel.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    contact_person: { type: String },
    address: { type: String },
    country: { type: String },
    city: { type: String },
    description: { type: String },
    image:{ type: String },
    chemical_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chemical' }]
});

module.exports = mongoose.model('supplier', supplierSchema);
