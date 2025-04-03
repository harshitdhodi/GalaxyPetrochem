const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
  privacyPolicy: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Privacy = mongoose.model('Privacy', privacySchema);

module.exports = Privacy;