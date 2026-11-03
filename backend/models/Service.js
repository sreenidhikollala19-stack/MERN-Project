const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorProfile',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: 0,
    },
    pricingUnit: {
      type: String,
      enum: ['per event', 'per day', 'per hour', 'per plate', 'per person', 'custom'],
      default: 'per event',
    },
    deliverables: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);

