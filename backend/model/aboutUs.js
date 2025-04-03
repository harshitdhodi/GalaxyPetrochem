const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
    title: String,
    shortDescription: String,
    description: String,
    image: String,
    imageTitle: String,
    altName: String,
    slug: {
        type: String,
        unique: true,
        required: true
    },
    section: {
        type: String,
        enum: ['Introduction', 'Mission Vision'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AboutUs', aboutUsSchema); 