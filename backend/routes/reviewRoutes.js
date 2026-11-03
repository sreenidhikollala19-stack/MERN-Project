const express = require('express');
const router = express.Router();
const { getVendorReviews, addReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/vendor/:vendorId', getVendorReviews);
router.post('/vendor/:vendorId', protect, authorize('customer'), addReview);

module.exports = router;

