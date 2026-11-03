const ServiceCategory = require('../models/ServiceCategory');

// @desc    Get all service categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.popular === 'true') {
      filter.isPopular = true;
    }

    const categories = await ServiceCategory.find(filter).sort({ displayOrder: 1, name: 1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories',
    });
  }
};

// @desc    Get single category by slug or id
// @route   GET /api/categories/:slugOrId
// @access  Public
exports.getCategoryBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let category = null;

    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      category = await ServiceCategory.findById(slugOrId);
    }
    if (!category) {
      category = await ServiceCategory.findOne({ slug: slugOrId.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch category',
    });
  }
};

// @desc    Create new category (Admin)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon, image, isPopular, displayOrder } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await ServiceCategory.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }

    const category = await ServiceCategory.create({
      name,
      slug,
      description,
      icon: icon || 'Sparkles',
      image,
      isPopular: !!isPopular,
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category',
    });
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const { name, description, icon, image, isPopular, displayOrder } = req.body;
    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;
    if (image) category.image = image;
    if (isPopular !== undefined) category.isPopular = isPopular;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    await category.save();

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update category',
    });
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await category.deleteOne();
    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete category',
    });
  }
};

