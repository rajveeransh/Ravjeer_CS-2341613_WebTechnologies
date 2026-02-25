/**
 * controllers/authController.js
 *
 * Handles all authentication logic:
 * - register: Creates a new user account
 * - login:    Validates credentials and returns JWT
 * - getMe:    Returns the currently authenticated user
 * - updateProfile: Updates name, email, password, avatar
 */

const User          = require('../models/User');
const generateToken = require('../utils/generateToken');

// ── Helper: Build the user response object ───────────────
const userResponse = (user, token) => ({
  _id:       user._id,
  name:      user.name,
  email:     user.email,
  role:      user.role,
  avatar:    user.avatar,
  addresses: user.addresses,
  wishlist:  user.wishlist,
  createdAt: user.createdAt,
  token,
});

// ────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, email, and a password.',
      });
    }

    // Check for existing account
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Try logging in.',
      });
    }

    // Create new user (password hashed by pre-save hook in model)
    const user  = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: `Welcome to Rupkala, ${user.name}! 🎨 Your creative journey begins.`,
      data:    userResponse(user, token),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.',
      });
    }

    // Find user – explicitly select password since it's hidden by default
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "We couldn't find an account with that email. Want to register?",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `Good to see you, ${user.name}! 👋`,
      data:    userResponse(user, token),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get currently logged-in user
// @route   GET /api/auth/me
// @access  Private
// ────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data:    userResponse(user, null),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Update user profile (name, email, password, avatar)
// @route   PUT /api/auth/profile
// @access  Private
// ────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (name)   user.name   = name;
    if (email)  user.email  = email;
    if (avatar) user.avatar = avatar;

    // Only update password if explicitly provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters.',
        });
      }
      user.password = password; // Pre-save hook will re-hash it
    }

    const updatedUser = await user.save();
    const token       = generateToken(updatedUser._id);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data:    userResponse(updatedUser, token),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Add / update a shipping address
// @route   POST /api/auth/address
// @access  Private
// ────────────────────────────────────────────────────────
const addAddress = async (req, res) => {
  try {
    const { label, street, city, state, pincode, country } = req.body;

    const user = await User.findById(req.user._id);
    user.addresses.push({ label, street, city, state, pincode, country });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address saved!',
      data:    user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, addAddress };
