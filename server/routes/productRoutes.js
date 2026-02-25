/**
 * routes/productRoutes.js
 * Base path: /api/products
 */

const express = require('express');
const router  = express.Router();
const {
  getAllProducts,
  getProductById,
  getFeatured,
  addReview,
  getCategories,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/featured',          getFeatured);
router.get('/categories',        getCategories);
router.get('/',                  getAllProducts);
router.get('/:id',               getProductById);
router.post('/:id/reviews',      protect, addReview);

module.exports = router;
