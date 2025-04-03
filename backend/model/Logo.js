const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema(
  {
    headerLogo: {
      type: String,
     
    },
    headerLogoName: {
      type: String,
     
    },
    headerLogoAltName: {
        type: String,
       
      },
    favIcon: {
      type: String,
     
    },
    favIconName: {
      type: String,
     
    },
    favIconAltName: {
        type: String,
       
      },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Ensure only one logo record exists
logoSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    if (count > 0) {
      throw new Error('Only one logo record can exist');
    }
  }
  next();
});

module.exports = mongoose.model('Logo', logoSchema);
