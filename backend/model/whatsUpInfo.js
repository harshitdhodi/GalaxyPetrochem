const mongoose = require('mongoose');

const whatsupInfoSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  }
}, { timestamps: true });

const WhatsupInfo = mongoose.model('WhatsupInfo', whatsupInfoSchema);

module.exports = WhatsupInfo;