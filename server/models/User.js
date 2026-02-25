/**
 * models/User.js – Rupkala User Schema
 *
 * Represents a registered user on the platform.
 * Passwords are hashed before saving using bcryptjs.
 * The 'role' field separates regular users from admins.
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name.'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters.'],
    },

    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
    },

    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters.'],
      select: false, // Never returned in queries by default
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    avatar: {
      type: String,
      default: '', // URL to profile picture (optional)
    },

    // Saved delivery addresses for faster checkout
    addresses: [
      {
        label:    { type: String },           // e.g., "Home", "Office"
        street:   { type: String },
        city:     { type: String },
        state:    { type: String },
        pincode:  { type: String },
        country:  { type: String, default: 'India' },
      },
    ],

    // Wishlist – array of Product IDs
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// ── Pre-save Hook: Hash password before storing ─────────
userSchema.pre('save', async function (next) {
  // Only hash if the password field was modified (covers both new & updates)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12); // 12 rounds = strong hashing
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance Method: Compare raw password to hashed ────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
