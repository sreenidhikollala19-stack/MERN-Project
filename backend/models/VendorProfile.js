const mongoose = require('mongoose');

const portfolioImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    default: '',
  },
});

const vendorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Business description is required'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    },
    logoImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
      },
    ],
    city: {
      type: String,
      required: [true, 'City/Location is required'],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    startingPrice: {
      type: Number,
      default: 5000,
      min: 0,
      index: true,
    },
    experienceYears: {
      type: Number,
      default: 3,
      min: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available',
      index: true,
    },
    portfolioImages: [portfolioImageSchema],
    socialLinks: {
      website: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for searching by business name, tagline, description, and city
vendorProfileSchema.index({
  businessName: 'text',
  tagline: 'text',
  description: 'text',
  city: 'text',
});

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);

