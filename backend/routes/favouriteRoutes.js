const express = require('express');
const router = express.Router();
const {
  toggleFavourite,
  getCustomerFavourites,
  checkIsFavourite,
} = require('../controllers/favouriteController');
const { protect, authorize } = require('../middleware/auth');

router.post('/toggle/:vendorId', protect, authorize('customer'), toggleFavourite);
router.get('/', protect, authorize('customer'), getCustomerFavourites);
router.get('/check/:vendorId', protect, checkIsFavourite);

module.exports = router;

