const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', productController.getProducts);
router.post('/', protect, admin, upload.single('image'), productController.createProduct);
router.put('/:id', protect, admin, upload.single('image'), productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
