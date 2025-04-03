const mongoose = require('mongoose');

const termsConditionSchema = new mongoose.Schema({
  termsCondition: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const TermsCondition = mongoose.model('TermsCondition', termsConditionSchema);

module.exports = TermsCondition;