/**
 * routes/orderRoutes.js
 * Base path: /api/orders
 */

const express = require('express');
const router  = express.Router();
const { createOrder, getMyOrders, getOrderById, simulatePayment } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',            protect, createOrder);
router.get('/myorders',     protect, getMyOrders);
router.get('/:id',          protect, getOrderById);
router.post('/:id/pay',     protect, simulatePayment);

module.exports = router;
