/**
 * routes/designRoutes.js
 * Base path: /api/designs
 */

const express = require('express');
const router  = express.Router();
const {
  createDesign,
  getMyDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  uploadDesignImage,
} = require('../controllers/designController');
const { protect }             = require('../middleware/authMiddleware');
const { upload }              = require('../middleware/uploadMiddleware');

router.post('/upload',          protect, upload.single('image'), uploadDesignImage);
router.post('/',                protect, createDesign);
router.get('/mine',             protect, getMyDesigns);
router.get('/:id',              protect, getDesignById);
router.put('/:id',              protect, updateDesign);
router.delete('/:id',           protect, deleteDesign);

module.exports = router;
