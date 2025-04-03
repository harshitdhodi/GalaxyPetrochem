    const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    pageSlug: { 
        type: String,
        required: true 
    },
    image: { 
        type: String,
        required: true 
    },
    photo: {    
        type: String,
        required: true 
    },
    imgName: { 
        type: String,
        required: true 
    },
    altName: { 
        type: String,
        required: true 
    },
    title: { 
        type: String,
       default: "" 
    },
    details: { 
        type: String,
       default: "" 
    }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
