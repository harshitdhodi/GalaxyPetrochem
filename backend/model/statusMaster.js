const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('status', nameSchema);
