/**
 * models/Order.js – Rupkala Order Schema
 *
 * Captures a complete customer order including:
 * - Line items (products + optional custom design)
 * - Shipping address
 * - Payment information (dummy Razorpay simulation)
 * - Order lifecycle status
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name:      { type: String, required: true },   // Snapshot of name at purchase time
  image:     { type: String },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  size:      { type: String },
  color:     { type: String },

  // If the user attached a custom design to this item
  customDesign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    default: null,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    orderItems: [orderItemSchema],

    shippingAddress: {
      name:    { type: String, required: true },
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true },
      phone:   { type: String, required: true },
      country: { type: String, default: 'India' },
    },

    // Pricing breakdown
    itemsPrice:    { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    taxPrice:      { type: Number, default: 0 },
    totalPrice:    { type: Number, required: true },

    // Payment info (dummy Razorpay simulation)
    paymentMethod: {
      type: String,
      default: 'Razorpay',
    },
    paymentResult: {
      razorpayOrderId:   { type: String },
      razorpayPaymentId: { type: String },
      status:            { type: String },
      paidAt:            { type: Date },
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },

    // Order fulfilment status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },

    // Human-readable order number (e.g., RK-20241201-0042)
    orderNumber: {
      type: String,
      unique: true,
    },

    // Admin notes or customer special instructions
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// ── Pre-save: Generate friendly order number ─────────────
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `RK-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
