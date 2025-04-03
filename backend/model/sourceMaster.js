const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('source', nameSchema);
