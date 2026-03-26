const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');
const upload = require('../middleware/multerConfig');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, admin, upload.single('image'), productController.createProduct);
router.put('/:id', protect, admin, upload.single('image'), productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
