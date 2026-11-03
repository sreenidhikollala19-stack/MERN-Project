const mongoose = require('mongoose');
const VendorProfile = require('../models/VendorProfile');
const ServiceCategory = require('../models/ServiceCategory');
const Service = require('../models/Service');
const Package = require('../models/Package');
const Review = require('../models/Review');

// @desc    Get all vendors with advanced search, filtering, and sorting
// @route   GET /api/vendors
// @access  Public
exports.getVendors = async (req, res) => {
  try {
    const {
      search,
      city,
      category,
      minPrice,
      maxPrice,
      rating,
      availability,
      featured,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isApproved: true };

    // Search keyword
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { businessName: searchRegex },
        { tagline: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
      ];
    }

    // City / Location filter
    if (city && city.trim() !== '' && city.toLowerCase() !== 'all') {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    // Category filter (can be ID or category slug)
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.categories = category;
      } else {
        const foundCategory = await ServiceCategory.findOne({ slug: category.toLowerCase().trim() });
        if (foundCategory) {
          query.categories = foundCategory._id;
        }
      }
    }

    // Budget range filter
    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.startingPrice.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.startingPrice.$lte = Number(maxPrice);
      }
    }

    // Rating filter
    if (rating && !isNaN(Number(rating))) {
      query.rating = { $gte: Number(rating) };
    }

    // Availability status
    if (availability && ['available', 'busy', 'unavailable'].includes(availability)) {
      query.availabilityStatus = availability;
    }

    // Featured only
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOption = { featured: -1, rating: -1, createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { startingPrice: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { startingPrice: -1 };
    } else if (sort === 'rating_desc') {
      sortOption = { rating: -1, reviewCount: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [vendors, total] = await Promise.all([
      VendorProfile.find(query)
        .populate('categories', 'name slug icon')
        .populate('user', 'name email phone avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      VendorProfile.countDocuments(query),
    ]);

    // Distinct list of cities for frontend filter dropdown
    const availableCities = await VendorProfile.distinct('city', { isApproved: true });

    res.json({
      success: true,
      count: vendors.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      availableCities: availableCities.sort(),
      data: vendors,
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch vendors',
    });
  }
};

// @desc    Get single vendor by ID with full details (services, packages, reviews)
// @route   GET /api/vendors/:id
// @access  Public
exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID format',
      });
    }

    const vendor = await VendorProfile.findById(id)
      .populate('categories')
      .populate('user', 'name email phone avatar');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found',
      });
    }

    // Fetch vendor services, packages, and reviews in parallel
    const [services, packages, reviews] = await Promise.all([
      Service.find({ vendor: vendor._id }).populate('category', 'name slug'),
      Package.find({ vendor: vendor._id }).sort({ price: 1 }),
      Review.find({ vendor: vendor._id })
        .populate('customer', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(20),
    ]);

    res.json({
      success: true,
      data: {
        ...vendor.toObject(),
        services,
        packages,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch vendor profile',
    });
  }
};

// @desc    Get logged in vendor's own profile
// @route   GET /api/vendors/me/profile
// @access  Private/Vendor
exports.getMyVendorProfile = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ user: req.user._id })
      .populate('categories')
      .populate('user', 'name email phone avatar');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found. Please create one.',
      });
    }

    const [services, packages] = await Promise.all([
      Service.find({ vendor: vendor._id }).populate('category'),
      Package.find({ vendor: vendor._id }),
    ]);

    res.json({
      success: true,
      data: {
        ...vendor.toObject(),
        services,
        packages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve your vendor profile',
    });
  }
};

// @desc    Update logged in vendor's profile
// @route   PUT /api/vendors/me/profile
// @access  Private/Vendor
exports.updateMyVendorProfile = async (req, res) => {
  try {
    let vendor = await VendorProfile.findOne({ user: req.user._id });

    if (!vendor) {
      vendor = new VendorProfile({ user: req.user._id });
    }

    const {
      businessName,
      tagline,
      description,
      coverImage,
      logoImage,
      categories,
      city,
      address,
      startingPrice,
      experienceYears,
      availabilityStatus,
      socialLinks,
    } = req.body;

    if (businessName) vendor.businessName = businessName;
    if (tagline !== undefined) vendor.tagline = tagline;
    if (description) vendor.description = description;
    if (coverImage) vendor.coverImage = coverImage;
    if (logoImage) vendor.logoImage = logoImage;
    if (categories) vendor.categories = categories;
    if (city) vendor.city = city;
    if (address !== undefined) vendor.address = address;
    if (startingPrice !== undefined) vendor.startingPrice = Number(startingPrice);
    if (experienceYears !== undefined) vendor.experienceYears = Number(experienceYears);
    if (availabilityStatus) vendor.availabilityStatus = availabilityStatus;
    if (socialLinks) vendor.socialLinks = { ...vendor.socialLinks, ...socialLinks };

    await vendor.save();

    const populatedVendor = await VendorProfile.findById(vendor._id)
      .populate('categories')
      .populate('user', 'name email phone avatar');

    res.json({
      success: true,
      data: populatedVendor,
      message: 'Vendor profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update vendor profile',
    });
  }
};

// @desc    Add image to vendor portfolio
// @route   POST /api/vendors/me/portfolio
// @access  Private/Vendor
exports.addPortfolioImage = async (req, res) => {
  try {
    const { url, title, caption } = req.body;
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required',
      });
    }

    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    vendor.portfolioImages.push({ url, title: title || '', caption: caption || '' });
    await vendor.save();

    res.status(201).json({
      success: true,
      data: vendor.portfolioImages,
      message: 'Image added to portfolio successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add image to portfolio',
    });
  }
};

// @desc    Delete image from vendor portfolio
// @route   DELETE /api/vendors/me/portfolio/:imageId
// @access  Private/Vendor
exports.deletePortfolioImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    vendor.portfolioImages = vendor.portfolioImages.filter(
      (img) => img._id.toString() !== imageId
    );
    await vendor.save();

    res.json({
      success: true,
      data: vendor.portfolioImages,
      message: 'Portfolio image removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove image',
    });
  }
};

// ======================= SERVICES ======================= //

// @desc    Add service to vendor profile
// @route   POST /api/vendors/me/services
// @access  Private/Vendor
exports.addService = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const { name, category, description, price, pricingUnit, deliverables } = req.body;

    const service = await Service.create({
      vendor: vendor._id,
      category: category || (vendor.categories.length > 0 ? vendor.categories[0] : null),
      name,
      description: description || '',
      price: Number(price),
      pricingUnit: pricingUnit || 'per event',
      deliverables: Array.isArray(deliverables) ? deliverables : [],
    });

    const populatedService = await Service.findById(service._id).populate('category');

    res.status(201).json({
      success: true,
      data: populatedService,
      message: 'Service created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add service',
    });
  }
};

// @desc    Update vendor service
// @route   PUT /api/vendors/me/services/:serviceId
// @access  Private/Vendor
exports.updateService = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const service = await Service.findOne({ _id: req.params.serviceId, vendor: vendor._id });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found or unauthorized' });
    }

    const { name, category, description, price, pricingUnit, deliverables } = req.body;
    if (name) service.name = name;
    if (category) service.category = category;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = Number(price);
    if (pricingUnit) service.pricingUnit = pricingUnit;
    if (deliverables) service.deliverables = deliverables;

    await service.save();

    res.json({
      success: true,
      data: service,
      message: 'Service updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update service',
    });
  }
};

// @desc    Delete vendor service
// @route   DELETE /api/vendors/me/services/:serviceId
// @access  Private/Vendor
exports.deleteService = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const service = await Service.findOneAndDelete({ _id: req.params.serviceId, vendor: vendor._id });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete service',
    });
  }
};

// ======================= PACKAGES ======================= //

// @desc    Add package to vendor profile
// @route   POST /api/vendors/me/packages
// @access  Private/Vendor
exports.addPackage = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const { name, description, price, features, duration, isPopular } = req.body;

    const pkg = await Package.create({
      vendor: vendor._id,
      name,
      description: description || '',
      price: Number(price),
      features: Array.isArray(features) ? features : [features],
      duration: duration || 'Full Day',
      isPopular: !!isPopular,
    });

    res.status(201).json({
      success: true,
      data: pkg,
      message: 'Package created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add package',
    });
  }
};

// @desc    Update vendor package
// @route   PUT /api/vendors/me/packages/:packageId
// @access  Private/Vendor
exports.updatePackage = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const pkg = await Package.findOne({ _id: req.params.packageId, vendor: vendor._id });
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found or unauthorized' });
    }

    const { name, description, price, features, duration, isPopular } = req.body;
    if (name) pkg.name = name;
    if (description !== undefined) pkg.description = description;
    if (price !== undefined) pkg.price = Number(price);
    if (features) pkg.features = features;
    if (duration) pkg.duration = duration;
    if (isPopular !== undefined) pkg.isPopular = isPopular;

    await pkg.save();

    res.json({
      success: true,
      data: pkg,
      message: 'Package updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update package',
    });
  }
};

// @desc    Delete vendor package
// @route   DELETE /api/vendors/me/packages/:packageId
// @access  Private/Vendor
exports.deletePackage = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const pkg = await Package.findOneAndDelete({ _id: req.params.packageId, vendor: vendor._id });
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete package',
    });
  }
};

