const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendorById,
  getMyVendorProfile,
  updateMyVendorProfile,
  addPortfolioImage,
  deletePortfolioImage,
  addService,
  updateService,
  deleteService,
  addPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getVendors);

// Vendor-specific authenticated management routes
router.get('/me/profile', protect, authorize('vendor'), getMyVendorProfile);
router.put('/me/profile', protect, authorize('vendor'), updateMyVendorProfile);

// Portfolio images
router.post('/me/portfolio', protect, authorize('vendor'), addPortfolioImage);
router.delete('/me/portfolio/:imageId', protect, authorize('vendor'), deletePortfolioImage);

// Services
router.post('/me/services', protect, authorize('vendor'), addService);
router.put('/me/services/:serviceId', protect, authorize('vendor'), updateService);
router.delete('/me/services/:serviceId', protect, authorize('vendor'), deleteService);

// Packages
router.post('/me/packages', protect, authorize('vendor'), addPackage);
router.put('/me/packages/:packageId', protect, authorize('vendor'), updatePackage);
router.delete('/me/packages/:packageId', protect, authorize('vendor'), deletePackage);

// Public single vendor details by ID (must come after /me/* to prevent matching 'me' as an id)
router.get('/:id', getVendorById);

module.exports = router;

