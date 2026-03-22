const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/config/razorpay-key', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});
router.get('/:id', protect, getOrderById);

module.exports = router;
