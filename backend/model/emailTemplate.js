const mongoose = require('mongoose');

const EmailTemplate = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmailCategory',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('emailTemplate', EmailTemplate);
