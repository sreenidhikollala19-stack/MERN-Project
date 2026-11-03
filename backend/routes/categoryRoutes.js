const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlugOrId,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/:slugOrId', getCategoryBySlugOrId);

// Admin only category management
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;

