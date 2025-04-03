const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    image: { type: String, required: true },
    altText: { type: String, required: true },
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SlideShow', ImageSchema);
