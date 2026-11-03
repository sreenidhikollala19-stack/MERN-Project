const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorProfile',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Package price is required'],
      min: 0,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    duration: {
      type: String,
      default: 'Full Day',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Package', packageSchema);

