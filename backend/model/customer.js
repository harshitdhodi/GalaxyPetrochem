const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  chemicalId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chemical' }],
  name: { type: String },
  contactPerson: { type: String },
  email: { type: String, unique: true },
  mobile: { type: String },
  website: { type: String },
  address: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  description: { type: String, default: '' },
  image: { 
    type: String,
    validate: {
      validator: function(v) {
        // Allow null/undefined or string values only
        return v === null || v === undefined || typeof v === 'string';
      },
      message: props => `${props.value} is not a valid image filename!`
    }
  }
}, { timestamps: true });

// Add pre-save middleware to ensure image is always a string if present
customerSchema.pre('save', function(next) {
  if (this.image && Array.isArray(this.image)) {
    this.image = this.image[0];
  }
  next();
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
