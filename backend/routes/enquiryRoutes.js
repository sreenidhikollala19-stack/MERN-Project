const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getCustomerEnquiries,
  getVendorEnquiries,
  updateEnquiryStatus,
  getAllEnquiries,
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

// Customer routes
router.post('/', protect, authorize('customer'), createEnquiry);
router.get('/customer', protect, authorize('customer'), getCustomerEnquiries);

// Vendor routes
router.get('/vendor', protect, authorize('vendor'), getVendorEnquiries);
router.put('/:id/status', protect, authorize('vendor'), updateEnquiryStatus);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllEnquiries);

module.exports = router;

