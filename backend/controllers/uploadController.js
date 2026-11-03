const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      });
    }

    // Try Cloudinary first if credentials exist
    let url = await uploadToCloudinary(req.file.path, 'eventease/vendors');

    // Fallback to local server static path
    if (!url) {
      url = `/uploads/${req.file.filename}`;
    }

    res.json({
      success: true,
      url,
      filename: req.file.filename,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Image upload controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
};

