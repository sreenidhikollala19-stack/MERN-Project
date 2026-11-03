const Favourite = require('../models/Favourite');
const VendorProfile = require('../models/VendorProfile');

// @desc    Toggle favourite vendor (add or remove)
// @route   POST /api/favourites/toggle/:vendorId
// @access  Private/Customer
exports.toggleFavourite = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await VendorProfile.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    const existing = await Favourite.findOne({
      customer: req.user._id,
      vendor: vendorId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({
        success: true,
        isFavourite: false,
        message: 'Vendor removed from favourites',
      });
    } else {
      await Favourite.create({
        customer: req.user._id,
        vendor: vendorId,
      });
      return res.json({
        success: true,
        isFavourite: true,
        message: 'Vendor added to favourites',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle favourite',
    });
  }
};

// @desc    Get current customer's favourite vendors
// @route   GET /api/favourites
// @access  Private/Customer
exports.getCustomerFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ customer: req.user._id })
      .populate({
        path: 'vendor',
        populate: [
          { path: 'categories', select: 'name slug icon' },
          { path: 'user', select: 'name email phone avatar' },
        ],
      })
      .sort({ createdAt: -1 });

    const vendorList = favourites
      .filter((fav) => fav.vendor != null)
      .map((fav) => fav.vendor);

    res.json({
      success: true,
      count: vendorList.length,
      data: vendorList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve favourite vendors',
    });
  }
};

// @desc    Check if a specific vendor is in customer's favourites
// @route   GET /api/favourites/check/:vendorId
// @access  Private
exports.checkIsFavourite = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const exists = await Favourite.exists({
      customer: req.user._id,
      vendor: vendorId,
    });

    res.json({
      success: true,
      isFavourite: !!exists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check favourite status',
    });
  }
};

