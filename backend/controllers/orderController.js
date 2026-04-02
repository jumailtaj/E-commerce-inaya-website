const Order = require('../models/order');
const Product = require('../models/product');
const Payment = require('../models/payment');
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
  try {
    const razorpay = getRazorpayInstance();
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 1. Validate stock and capture Snapshots
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      
      const stockAvailable = product.stock !== undefined ? product.stock : product.inventory;
      if (stockAvailable < item.quantity) {
        return res.status(400).json({ message: `Insufficient inventory for ${product.title}` });
      }
      
      const price = product.discountPrice || product.price;
      totalAmount += price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.title,
        price: price,
        image: product.image,
        quantity: item.quantity
      });
    }

    // 2. Initialize Razorpay order
    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    // 3. Create Order Document
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      orderStatus: 'pending',
      paymentStatus: 'pending'
    });
    const savedOrder = await order.save();

    // 4. Create Payment Document
    const payment = new Payment({
      order: savedOrder._id,
      user: req.user._id,
      amount: totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending'
    });
    const savedPayment = await payment.save();

    // 5. Link Payment back to Order
    savedOrder.payment = savedPayment._id;
    await savedOrder.save();

    res.status(201).json({
      orderId: savedOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency
    });
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ message: 'Failed to initialize payment', error: error.message });
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
      // 1. Find and update payment
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      if (!payment) return res.status(404).json({ message: 'Payment record not found' });

      if (payment.status === 'completed') {
          return res.status(200).json({ message: 'Payment already verified' });
      }

      payment.status = 'completed';
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      await payment.save();

      // 2. Update order
      const order = await Order.findById(payment.order);
      order.paymentStatus = 'paid';
      order.orderStatus = 'placed';
      await order.save();

      // 3. Deduct stock atomically
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity, inventory: -item.quantity }
        });
      }

      res.status(200).json({ message: 'Payment verified successfully', order });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
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
      .populate('payment')
      .lean();
      
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Handle Razorpay Webhooks
// @route   POST /api/orders/webhook
exports.handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  try {
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (signature === digest) {
      const event = req.body.event;
      if (event === 'payment.captured') {
        const payload = req.body.payload.payment.entity;
        const razorpayOrderId = payload.order_id;
        
        const payment = await Payment.findOne({ razorpayOrderId });
        if (payment && payment.status === 'pending') {
          payment.status = 'completed';
          payment.razorpayPaymentId = payload.id;
          await payment.save();

          const order = await Order.findById(payment.order);
          if (order && order.paymentStatus === 'pending') {
            order.paymentStatus = 'paid';
            order.orderStatus = 'placed';
            await order.save();

            for (const item of order.items) {
              await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity, inventory: -item.quantity }
              });
            }
          }
        }
      }
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Mark order as failed
// @route   POST /api/orders/:id/fail
// @access  Private
exports.failOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.paymentStatus === 'pending') {
      order.paymentStatus = 'failed';
      await order.save();
      
      const payment = await Payment.findOne({ order: order._id });
      if (payment) {
          payment.status = 'failed';
          await payment.save();
      }
    }
    
    res.json({ message: 'Order marked as failed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
