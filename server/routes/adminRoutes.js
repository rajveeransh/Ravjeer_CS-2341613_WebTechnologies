/**
 * routes/adminRoutes.js
 * Base path: /api/admin
 * All routes require: protect + adminOnly middleware
 */

const express  = require('express');
const router   = express.Router();
const {
  getDashboardStats,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
  uploadProductImage,
} = require('../controllers/adminController');
const { protect }    = require('../middleware/authMiddleware');
const { adminOnly }  = require('../middleware/adminMiddleware');
const { upload }     = require('../middleware/uploadMiddleware');

// Apply auth + admin check to all routes in this file
router.use(protect, adminOnly);

// Stats
router.get('/stats',                          getDashboardStats);

// Products
router.post('/products',                      createProduct);
router.put('/products/:id',                   updateProduct);
router.delete('/products/:id',                deleteProduct);
router.post('/products/upload-image',         upload.single('image'), uploadProductImage);

// Orders
router.get('/orders',                         getAllOrders);
router.put('/orders/:id/status',              updateOrderStatus);

// Users
router.get('/users',                          getAllUsers);
router.put('/users/:id/role',                 updateUserRole);
router.delete('/users/:id',                   deleteUser);

module.exports = router;
