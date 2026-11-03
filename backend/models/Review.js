const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, 'Rating is required between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    eventType: {
      type: String,
      default: 'Event',
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average rating and review count when a review is saved
reviewSchema.statics.calculateAverageRating = async function (vendorId) {
  const stats = await this.aggregate([
    { $match: { vendor: vendorId } },
    {
      $group: {
        _id: '$vendor',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const VendorProfile = mongoose.model('VendorProfile');
  if (stats.length > 0) {
    await VendorProfile.findByIdAndUpdate(vendorId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await VendorProfile.findByIdAndUpdate(vendorId, {
      rating: 5.0,
      reviewCount: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.vendor);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.vendor);
});

module.exports = mongoose.model('Review', reviewSchema);

