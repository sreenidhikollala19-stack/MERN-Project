const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');
const Enquiry = require('../models/Enquiry');
const ServiceCategory = require('../models/ServiceCategory');

// @desc    Get dashboard metrics & summary
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalVendors,
      pendingVendors,
      totalEnquiries,
      totalCategories,
      recentEnquiries,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      VendorProfile.countDocuments(),
      VendorProfile.countDocuments({ isApproved: false }),
      Enquiry.countDocuments(),
      ServiceCategory.countDocuments(),
      Enquiry.find()
        .populate('vendor', 'businessName city')
        .populate('customer', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalVendors,
        pendingVendors,
        totalEnquiries,
        totalCategories,
        recentEnquiries,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin stats',
    });
  }
};

// @desc    Get all vendors with filter by approval status
// @route   GET /api/admin/vendors
// @access  Private/Admin
exports.getAdminVendors = async (req, res) => {
  try {
    const { status } = req.query; // 'pending', 'approved', 'all'
    const query = {};

    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }

    const vendors = await VendorProfile.find(query)
      .populate('user', 'name email phone isActive createdAt')
      .populate('categories', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch vendors',
    });
  }
};

// @desc    Approve or reject a vendor
// @route   PUT /api/admin/vendors/:id/approval
// @access  Private/Admin
exports.updateVendorApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const vendor = await VendorProfile.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    vendor.isApproved = Boolean(isApproved);
    await vendor.save();

    res.json({
      success: true,
      data: vendor,
      message: vendor.isApproved
        ? 'Vendor approved successfully. Their profile is now live!'
        : 'Vendor status set to rejected / unapproved.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update vendor approval',
    });
  }
};

// @desc    Delete vendor profile and listing
// @route   DELETE /api/admin/vendors/:id
// @access  Private/Admin
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await VendorProfile.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    await vendor.deleteOne();

    res.json({
      success: true,
      message: 'Vendor listing removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete vendor',
    });
  }
};

// @desc    Get all registered users (Customers & Vendors)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAdminUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role && ['customer', 'vendor', 'admin'].includes(role)) {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users',
    });
  }
};

// @desc    Toggle user active/deactivated status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Do not allow deactivating self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own admin account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      data: user,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle user status',
    });
  }
};

