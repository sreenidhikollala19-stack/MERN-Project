const Enquiry = require('../models/Enquiry');
const VendorProfile = require('../models/VendorProfile');

// @desc    Submit a new event enquiry
// @route   POST /api/enquiries
// @access  Private/Customer
exports.createEnquiry = async (req, res) => {
  try {
    const {
      vendorId,
      name,
      email,
      phone,
      eventType,
      eventDate,
      eventLocation,
      serviceType,
      expectedBudget,
      message,
    } = req.body;

    const vendor = await VendorProfile.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    const enquiry = await Enquiry.create({
      customer: req.user._id,
      vendor: vendor._id,
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      eventType,
      eventDate,
      eventLocation,
      serviceType,
      expectedBudget: Number(expectedBudget),
      message: message || '',
      status: 'Pending',
    });

    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate('vendor', 'businessName city coverImage rating')
      .populate('customer', 'name email phone avatar');

    res.status(201).json({
      success: true,
      data: populatedEnquiry,
      message: 'Enquiry submitted successfully! The vendor has been notified.',
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit enquiry',
    });
  }
};

// @desc    Get customer's enquiries
// @route   GET /api/enquiries/customer
// @access  Private/Customer
exports.getCustomerEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ customer: req.user._id })
      .populate({
        path: 'vendor',
        select: 'businessName city coverImage rating startingPrice user',
        populate: { path: 'user', select: 'name phone email' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch your enquiries',
    });
  }
};

// @desc    Get vendor's enquiries (for Vendor Dashboard)
// @route   GET /api/enquiries/vendor
// @access  Private/Vendor
exports.getVendorEnquiries = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    const { status } = req.query;
    const filter = { vendor: vendor._id };
    if (status && ['Pending', 'Accepted', 'Rejected', 'Completed'].includes(status)) {
      filter.status = status;
    }

    const enquiries = await Enquiry.find(filter)
      .populate('customer', 'name email phone avatar')
      .sort({ createdAt: -1 });

    // Summary counts for vendor dashboard
    const counts = await Enquiry.aggregate([
      { $match: { vendor: vendor._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const stats = {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      completed: 0,
    };

    counts.forEach((item) => {
      stats.total += item.count;
      if (item._id === 'Pending') stats.pending = item.count;
      if (item._id === 'Accepted') stats.accepted = item.count;
      if (item._id === 'Rejected') stats.rejected = item.count;
      if (item._id === 'Completed') stats.completed = item.count;
    });

    res.json({
      success: true,
      count: enquiries.length,
      stats,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch vendor enquiries',
    });
  }
};

// @desc    Update enquiry status (Vendor action: Accept, Reject, Complete)
// @route   PUT /api/enquiries/:id/status
// @access  Private/Vendor
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status, vendorNotes } = req.body;

    if (!['Pending', 'Accepted', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Only registered vendors can update enquiries',
      });
    }

    const enquiry = await Enquiry.findOne({ _id: req.params.id, vendor: vendor._id });
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found or unauthorized',
      });
    }

    enquiry.status = status;
    if (vendorNotes !== undefined) enquiry.vendorNotes = vendorNotes;
    await enquiry.save();

    res.json({
      success: true,
      data: enquiry,
      message: `Enquiry status updated to '${status}' successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update enquiry status',
    });
  }
};

// @desc    Get all platform enquiries (Admin Monitor)
// @route   GET /api/enquiries/admin/all
// @access  Private/Admin
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('vendor', 'businessName city')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch platform enquiries',
    });
  }
};

