/**
 * controllers/productController.js
 *
 * Public and user-facing product operations:
 * - getAllProducts:   Paginated, filterable catalogue
 * - getProductById:  Single product by ID or slug
 * - getFeatured:     Featured products for homepage
 * - addReview:       Logged-in user submits a review
 * - searchProducts:  Text search by name/description
 */

const Product = require('../models/Product');

// ────────────────────────────────────────────────────────
// @desc    Get all products (with pagination + filters)
// @route   GET /api/products
// @access  Public
// Query params: category, minPrice, maxPrice, size, sort, page, limit
// ────────────────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, page = 1, limit = 12, search } = req.query;

    // Build dynamic filter object
    const filter = { isActive: true };

    if (category)                 filter.category = category;
    if (minPrice || maxPrice)     filter.price     = {};
    if (minPrice)                 filter.price.$gte = Number(minPrice);
    if (maxPrice)                 filter.price.$lte = Number(maxPrice);

    // Simple text search on name and tagline
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { tagline:     { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    let sortObj = { createdAt: -1 }; // Default: newest first
    if (sort === 'price-asc')  sortObj = { price: 1 };
    if (sort === 'price-desc') sortObj = { price: -1 };
    if (sort === 'rating')     sortObj = { rating: -1 };
    if (sort === 'popular')    sortObj = { numReviews: -1 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .select('-reviews'); // Reviews fetched separately for performance

    res.status(200).json({
      success: true,
      total,
      page:       Number(page),
      pages:      Math.ceil(total / limit),
      count:      products.length,
      data:       products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
// ────────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Support both MongoDB _id and SEO slug
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { slug: id };

    const product = await Product.findOne(query).populate('reviews.user', 'name avatar');

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get featured products (for homepage)
// @route   GET /api/products/featured
// @access  Public
// ────────────────────────────────────────────────────────
const getFeatured = async (req, res) => {
  try {
    const products = await Product
      .find({ isFeatured: true, isActive: true })
      .limit(8)
      .select('-reviews');

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
// ────────────────────────────────────────────────────────
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Prevent duplicate reviews from the same user
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product.',
      });
    }

    // Append review
    product.reviews.push({
      user:    req.user._id,
      name:    req.user.name,
      rating:  Number(rating),
      comment,
    });

    // Recalculate aggregate rating
    product.numReviews = product.reviews.length;
    product.rating     = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

    await product.save();

    res.status(201).json({ success: true, message: 'Review submitted. Thank you!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get all product categories
// @route   GET /api/products/categories
// @access  Public
// ────────────────────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeatured,
  addReview,
  getCategories,
};
