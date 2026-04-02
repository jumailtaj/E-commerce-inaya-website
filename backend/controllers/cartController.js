const Cart = require('../models/cart');
const Product = require('../models/product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'title price image discountPrice stock isActive')
      .lean();

    if (!cart) {
      return res.status(200).json({ items: [], updatedAt: Date.now() });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        // Increment quantity if already in cart
        existingItem.quantity += Number(quantity);
        // Cap by stock if needed
        if (existingItem.quantity > product.stock) {
            existingItem.quantity = product.stock;
        }
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const item = cart.items.find(item => item.product.toString() === productId);
      if (!item) return res.status(404).json({ message: 'Item not in cart' });

      // Check stock
      const product = await Product.findById(productId);
      if (product && product.stock < quantity) {
          return res.status(400).json({ message: `Only ${product.stock} items left in stock` });
      }

      item.quantity = quantity;
      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity
};
