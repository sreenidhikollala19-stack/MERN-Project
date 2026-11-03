const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;

