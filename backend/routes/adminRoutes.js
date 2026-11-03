const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminVendors,
  updateVendorApproval,
  deleteVendor,
  getAdminUsers,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/vendors', getAdminVendors);
router.put('/vendors/:id/approval', updateVendorApproval);
router.delete('/vendors/:id', deleteVendor);
router.get('/users', getAdminUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;

