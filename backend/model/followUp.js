const mongoose = require('mongoose');
const Inquiry = require('../model/inquiry')
// Define the schema for the message
const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now, // default to the current date
    },
    inquiryId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Inquiry schema
      ref: 'inquiry', // The model name to reference
      required: true, // Ensure that an inquiryId is provided
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model
const Message = mongoose.model('FollowUp', messageSchema);

module.exports = Message;
