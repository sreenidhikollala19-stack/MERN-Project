const cloudinary = require('cloudinary').v2;
const fs = require('fs');

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadToCloudinary = async (filePath, folder = 'eventease') => {
  try {
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'image',
      });
      // Remove temporary local file if created
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return result.secure_url;
    }
    // Fallback: If cloudinary not configured, return the local file path as static route
    return null;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};

