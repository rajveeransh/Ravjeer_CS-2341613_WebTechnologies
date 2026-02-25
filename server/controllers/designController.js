/**
 * controllers/designController.js
 *
 * Handles custom design operations:
 * - createDesign:   Save a new design (linked to a product + user)
 * - getMyDesigns:   List all saved designs for current user
 * - getDesignById:  Get a single design
 * - updateDesign:   Update design layers or title
 * - deleteDesign:   Remove a saved design
 */

const Design = require('../models/Design');

// ────────────────────────────────────────────────────────
// @desc    Create / save a new custom design
// @route   POST /api/designs
// @access  Private
// ────────────────────────────────────────────────────────
const createDesign = async (req, res) => {
  try {
    const { product, title, textLayer, imageLayer, printPosition, previewImage } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Please select a product to design on.',
      });
    }

    const design = await Design.create({
      user:  req.user._id,
      product,
      title: title || 'My Custom Design',
      textLayer,
      imageLayer,
      printPosition,
      previewImage,
      isSaved: true,
    });

    res.status(201).json({
      success: true,
      message: '✨ Design saved! Find it in your dashboard.',
      data:    design,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get all designs for the logged-in user
// @route   GET /api/designs/mine
// @access  Private
// ────────────────────────────────────────────────────────
const getMyDesigns = async (req, res) => {
  try {
    const designs = await Design
      .find({ user: req.user._id, isSaved: true })
      .sort({ updatedAt: -1 })
      .populate('product', 'name images');

    res.status(200).json({ success: true, count: designs.length, data: designs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get a single design by ID
// @route   GET /api/designs/:id
// @access  Private (owner only)
// ────────────────────────────────────────────────────────
const getDesignById = async (req, res) => {
  try {
    const design = await Design
      .findById(req.params.id)
      .populate('product', 'name images colors sizes printPositions');

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found.' });
    }

    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not your design.' });
    }

    res.status(200).json({ success: true, data: design });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Update a saved design
// @route   PUT /api/designs/:id
// @access  Private (owner only)
// ────────────────────────────────────────────────────────
const updateDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found.' });
    }
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not your design.' });
    }

    const { title, textLayer, imageLayer, printPosition, previewImage } = req.body;

    if (title)         design.title         = title;
    if (textLayer)     design.textLayer     = { ...design.textLayer, ...textLayer };
    if (imageLayer)    design.imageLayer    = { ...design.imageLayer, ...imageLayer };
    if (printPosition) design.printPosition = printPosition;
    if (previewImage)  design.previewImage  = previewImage;

    const updated = await design.save();

    res.status(200).json({
      success: true,
      message: 'Design updated!',
      data:    updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Delete a saved design
// @route   DELETE /api/designs/:id
// @access  Private (owner only)
// ────────────────────────────────────────────────────────
const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found.' });
    }
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not your design.' });
    }

    await design.deleteOne();

    res.status(200).json({ success: true, message: 'Design deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Upload image for design canvas
// @route   POST /api/designs/upload
// @access  Private
// ────────────────────────────────────────────────────────
const uploadDesignImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, data: { url: imageUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDesign,
  getMyDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  uploadDesignImage,
};
