/**
 * controllers/orderController.js
 *
 * Handles the full order lifecycle from the user perspective:
 * - createOrder:     Place a new order
 * - getMyOrders:     Retrieve current user's order history
 * - getOrderById:    Get a single order (owner only)
 * - simulatePayment: Dummy Razorpay payment simulation
 */

const Order   = require('../models/Order');
const Product = require('../models/Product');

// ────────────────────────────────────────────────────────
// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
// ────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order. Add products to your cart first.',
      });
    }

    // Validate stock availability for each item
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found.`,
        });
      }

      // Check size stock if size is specified
      if (item.size) {
        const sizeOption = product.sizes.find((s) => s.label === item.size);
        if (!sizeOption || sizeOption.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `${item.name} (Size: ${item.size}) has insufficient stock.`,
          });
        }
      }
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Razorpay',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: '🎉 Order placed! We\'re getting your tee ready.',
      data:    order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
// ────────────────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name images slug');

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get a specific order by ID
// @route   GET /api/orders/:id
// @access  Private (owner only)
// ────────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order
      .findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images slug');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Users can only view their own orders (admins bypass this via adminRoutes)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorised to view this order.',
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Simulate Razorpay payment (dummy integration)
// @route   POST /api/orders/:id/pay
// @access  Private
//
// In a real integration you'd verify Razorpay's signature.
// Here we just mark the order as paid with dummy values.
// ────────────────────────────────────────────────────────
const simulatePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'This order has already been paid.',
      });
    }

    // Dummy Razorpay payment result
    order.isPaid  = true;
    order.paidAt  = new Date();
    order.status  = 'confirmed';
    order.paymentResult = {
      razorpayOrderId:   `order_dummy_${Date.now()}`,
      razorpayPaymentId: `pay_dummy_${Date.now()}`,
      status:            'captured',
      paidAt:            new Date(),
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: '💳 Payment successful! Your Rupkala tee is confirmed.',
      data:    updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, simulatePayment };
