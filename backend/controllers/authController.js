const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user (Customer or Vendor)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, businessName, city, categoryId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const assignedRole = role === 'vendor' ? 'vendor' : 'customer';

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
    });

    let vendorProfile = null;

    // If role is vendor, create initial vendor profile
    if (assignedRole === 'vendor') {
      vendorProfile = await VendorProfile.create({
        user: user._id,
        businessName: businessName || `${name}'s Services`,
        description: 'Professional event service provider dedicated to crafting unforgettable celebrations.',
        tagline: 'Delivering exceptional event experiences',
        city: city || 'Mumbai',
        categories: categoryId ? [categoryId] : [],
        isApproved: false, // requires admin approval or can be toggled by admin
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      vendorProfileId: vendorProfile ? vendorProfile._id : null,
      message: assignedRole === 'vendor'
        ? 'Registration successful! Your vendor profile has been created and is pending admin approval.'
        : 'Registration successful! Welcome to EventEase.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    const token = generateToken(user._id);

    let vendorProfile = null;
    if (user.role === 'vendor') {
      vendorProfile = await VendorProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      vendorProfile: vendorProfile
        ? {
            id: vendorProfile._id,
            businessName: vendorProfile.businessName,
            isApproved: vendorProfile.isApproved,
            city: vendorProfile.city,
          }
        : null,
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current authenticated user info
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let vendorProfile = null;

    if (user.role === 'vendor') {
      vendorProfile = await VendorProfile.findOne({ user: user._id }).populate('categories');
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      vendorProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve user profile',
    });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

