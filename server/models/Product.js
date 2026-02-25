/**
 * models/Product.js – Rupkala Product Schema
 *
 * Represents a t-shirt product in the catalogue.
 * Supports multiple color and size variants,
 * a gallery of images, ratings, and custom design options.
 */

const mongoose = require('mongoose');

// Sub-schema for customer reviews
const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
    },

    // Short tagline shown on cards ("Wear your fire")
    tagline: {
      type: String,
      trim: true,
      default: '',
    },

    description: {
      type: String,
      required: [true, 'Product description is required.'],
    },

    // Fabric, fit, wash care, etc.
    details: {
      fabric:   { type: String, default: '100% Cotton' },
      fit:      { type: String, default: 'Regular Fit' },
      washCare: { type: String, default: 'Machine wash cold' },
      weight:   { type: String, default: '180 GSM' },
    },

    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative.'],
    },

    // Discounted price (optional)
    salePrice: {
      type: Number,
      default: null,
    },

    category: {
      type: String,
      required: true,
      enum: ['graphic-tee', 'plain', 'custom', 'oversized', 'crop', 'polo'],
    },

    // Available sizes with stock count
    sizes: [
      {
        label: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        stock: { type: Number, default: 0 },
      },
    ],

    // Available colour options with hex code
    colors: [
      {
        name:     { type: String },   // e.g., "Midnight Black"
        hexCode:  { type: String },   // e.g., "#1a1a1a"
        imageUrl: { type: String },   // Optional per-colour product image
      },
    ],

    // Array of product image URLs
    images: [{ type: String }],

    // Whether customers can add a custom design to this product
    allowCustomDesign: {
      type: Boolean,
      default: true,
    },

    // Available print positions (front, back, left sleeve, etc.)
    printPositions: {
      type: [String],
      default: ['front', 'back'],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    reviews: [reviewSchema],

    // Calculated fields – updated when reviews change
    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    // SEO slug (e.g., "cosmic-dreams-graphic-tee")
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// ── Pre-save: Auto-generate slug from name ───────────────
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      + '-' + Date.now();
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
