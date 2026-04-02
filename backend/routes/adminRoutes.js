const express = require('express');
const router = express.Router();
const { getAllOrders, getAdminOrderById, updateOrderStatus } = require('../controllers/adminOrderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin); // All admin routes require admin privileges

// Orders Management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
