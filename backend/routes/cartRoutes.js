const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartQuantity } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All cart routes require login

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartQuantity);
router.delete('/remove/:productId', removeFromCart);

module.exports = router;
