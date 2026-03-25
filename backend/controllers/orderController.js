const Order = require('../models/order');
const Product = require('../models/product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Function to get Razorpay instance
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are missing in environment variables');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

// @desc    Create a new Razorpay order
// @route   POST /api/orders/create
// @access  Private
exports.createOrder = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated in request' });
  }
  
  console.log('Using Razorpay Key:', process.env.RAZORPAY_KEY_ID);
  try {
    const razorpay = getRazorpayInstance();
    const { items, shippingAddress } = req.body;

    console.log('Creating order for items:', JSON.stringify(items));
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Calculate total amount and verify products
    for (const item of items) {
      console.log('Checking product with ID:', item.product);
      const product = await Product.findById(item.product);
      if (!product) {
        console.error('Product NOT found for ID:', item.product);
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      console.log('Found product:', product.title || product.name, 'Inventory:', product.inventory, 'Stock:', product.stock);
      const stockAvailable = product.inventory !== undefined ? product.inventory : product.stock;
      if (stockAvailable < item.quantity) {
        console.error('Insufficient inventory for:', product.title || product.name);
        return res.status(400).json({ message: `Insufficient inventory for ${product.title || product.name}` });
      }
      
      const price = product.price;
      totalAmount += price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: price
      });
    }

    // Razorpay options
    const options = {
      amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    console.log('Initializing Razorpay order with options:', JSON.stringify(options));
    const razorpayOrder = await razorpay.orders.create(options);
    console.log('Razorpay order created:', razorpayOrder.id);

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending'
    });

    const createdOrder = await order.save();

    res.status(201).json({
      orderId: createdOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency
    });
  } catch (error) {
    console.error('Detailed Error creating order:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: error.stack,
      fullError: error
    });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/orders/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.paymentStatus = 'completed';
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      await order.save();

      // Update product inventory (handling both fields)
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          if (product.inventory !== undefined) product.inventory -= item.quantity;
          if (product.stock !== undefined) product.stock -= item.quantity;
          await product.save();
        }
      }

      res.status(200).json({ message: 'Payment verified successfully', order });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'title image')
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title image price')
      .lean();
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
