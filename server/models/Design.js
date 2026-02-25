/**
 * models/Design.js – Rupkala Custom Design Schema
 *
 * Stores a user's custom t-shirt design configuration.
 * A design can be linked to an order or saved independently
 * in the user's "Saved Designs" dashboard.
 */

const mongoose = require('mongoose');

const designSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // The base product this design is applied on
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    // A friendly name the user gives their design
    title: {
      type: String,
      default: 'My Custom Design',
      trim: true,
    },

    // Text layer configuration
    textLayer: {
      content:    { type: String, default: '' },       // The actual text
      font:       { type: String, default: 'Arial' },  // Font family
      fontSize:   { type: Number, default: 24 },
      color:      { type: String, default: '#000000' },
      bold:       { type: Boolean, default: false },
      italic:     { type: Boolean, default: false },
      positionX:  { type: Number, default: 0 },        // % offset from left
      positionY:  { type: Number, default: 0 },        // % offset from top
    },

    // Uploaded image layer (user's artwork)
    imageLayer: {
      url:       { type: String, default: '' },   // Path to uploaded file
      positionX: { type: Number, default: 0 },
      positionY: { type: Number, default: 0 },
      width:     { type: Number, default: 100 },  // px
      height:    { type: Number, default: 100 },  // px
    },

    // Where on the shirt is the design placed
    printPosition: {
      type: String,
      enum: ['front', 'back', 'left-sleeve', 'right-sleeve'],
      default: 'front',
    },

    // Snapshot / preview image of the final design (generated on frontend)
    previewImage: {
      type: String,
      default: '',
    },

    // Whether it's saved to the user's dashboard (vs. a temporary draft)
    isSaved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Design = mongoose.model('Design', designSchema);
module.exports = Design;
