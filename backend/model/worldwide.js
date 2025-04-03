const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const worldwideSchema = new Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        trim: true,
        default: ''
    },
    cities: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
worldwideSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Worldwide', worldwideSchema);
