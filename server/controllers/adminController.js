/**
 * controllers/adminController.js
 *
 * Admin-only operations:
 * - Dashboard stats
 * - Product CRUD
 * - Order management
 * - User management
 */

const Product = require('../models/Product');
const Order   = require('../models/Order');
const User    = require('../models/User');

// ────────────────────────────────────────────────────────
// @desc    Get dashboard overview statistics
// @route   GET /api/admin/stats
// @access  Admin
// ────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      recentOrders,
      pendingOrders,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Order.countDocuments({ status: 'pending' }),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════ PRODUCT MANAGEMENT ═══════════════

// @route   POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new:            true,
      runValidators:  true,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.status(200).json({ success: true, message: 'Product updated.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    // Soft delete: mark as inactive rather than removing from DB
    product.isActive = false;
    await product.save();

    res.status(200).json({ success: true, message: 'Product deactivated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════ ORDER MANAGEMENT ═══════════════

// @route   GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip   = (Number(page) - 1) * Number(limit);
    const total  = await Order.countDocuments(filter);

    const orders = await Order
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email');

    res.status(200).json({ success: true, total, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;
    if (status === 'delivered') {
      order.isDelivered  = true;
      order.deliveredAt  = new Date();
    }

    await order.save();
    res.status(200).json({ success: true, message: `Order marked as ${status}.`, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════ USER MANAGEMENT ═══════════════

// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: `User role updated to ${role}.`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Upload product image
// @route   POST /api/admin/products/upload-image
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, data: { url: imageUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
