const mongoose = require('mongoose');

const emailCategorySchema = new mongoose.Schema({
    emailCategory: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EmailCategory', emailCategorySchema);
