const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorProfile',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

favouriteSchema.index({ customer: 1, vendor: 1 }, { unique: true });

module.exports = mongoose.model('Favourite', favouriteSchema);

