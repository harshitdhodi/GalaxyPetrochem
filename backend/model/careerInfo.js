const mongoose = require('mongoose');

const careerInfoSchema = new mongoose.Schema({
  info: {
    type: String,
    
  },
  image: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

careerInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const CareerInfo = mongoose.model('CareerInfo', careerInfoSchema);

module.exports = CareerInfo;