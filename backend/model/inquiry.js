const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String },
    country: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    message: { type: String, required: true },
    needCallback: { type: Boolean, default: false },
    status: { type: String, default: '' },
    source: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('inquiry', contactSchema);
