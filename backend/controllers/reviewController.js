const Review = require('../models/Review');
const VendorProfile = require('../models/VendorProfile');

// @desc    Get reviews for a vendor
// @route   GET /api/reviews/vendor/:vendorId
// @access  Public
exports.getVendorReviews = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const reviews = await Review.find({ vendor: vendorId })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reviews',
    });
  }
};

// @desc    Add a review for a vendor
// @route   POST /api/reviews/vendor/:vendorId
// @access  Private/Customer
exports.addReview = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rating, comment, eventType } = req.body;

    const vendor = await VendorProfile.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    // Check if customer already reviewed this vendor
    const existingReview = await Review.findOne({
      customer: req.user._id,
      vendor: vendorId,
    });

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
      if (eventType) existingReview.eventType = eventType;
      await existingReview.save();

      const populated = await Review.findById(existingReview._id).populate('customer', 'name avatar');
      return res.json({
        success: true,
        data: populated,
        message: 'Your review has been updated successfully',
      });
    }

    const review = await Review.create({
      customer: req.user._id,
      vendor: vendorId,
      rating: Number(rating),
      comment,
      eventType: eventType || 'Event Celebration',
    });

    const populated = await Review.findById(review._id).populate('customer', 'name avatar');

    res.status(201).json({
      success: true,
      data: populated,
      message: 'Review posted successfully. Thank you for your feedback!',
    });
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit review',
    });
  }
};

