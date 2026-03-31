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
    
    if (!razorpayOrder || !razorpayOrder.id) {
      console.error('Razorpay order creation returned invalid response:', razorpayOrder);
      throw new Error('Failed to create Razorpay order');
    }
    
    console.log('Razorpay order created successfully:', razorpayOrder.id);

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending'
    });

    const createdOrder = await order.save();
    console.log('Order saved to database:', createdOrder._id);

    res.status(201).json({
      orderId: createdOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency
    });
  } catch (error) {
    console.error('CRITICAL ERROR in createOrder:', {
      message: error.message,
      stack: error.stack,
      razorpayError: error.payment_id ? error : 'N/A' // Razorpay errors sometimes have unique fields
    });
    
    res.status(500).json({ 
      message: 'Failed to initialize payment. ' + (error.message || 'Please try again.'), 
      error: error.message,
      // Temporarily include full error for easier debugging by the user
      details: error
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
      console.log('Payment verified successfully for order:', razorpay_order_id);
      
      // IDEMPOTENCY CHECK: Check if this payment_id has already been processed
      const existingPayment = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
      if (existingPayment) {
        console.warn('Idempotency alert: payment_id already processed:', razorpay_payment_id);
        return res.status(200).json({ message: 'Payment already processed', order: existingPayment });
      }

      order.paymentStatus = 'paid';
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      await order.save();
      console.log(`SECURE LOG: Order marked as PAID. OrderID: ${order._id}, RazorpayOrderID: ${razorpay_order_id}, PaymentID: ${razorpay_payment_id}`);

      // Update product inventory
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const oldStock = product.inventory !== undefined ? product.inventory : product.stock;
          if (product.inventory !== undefined) product.inventory -= item.quantity;
          if (product.stock !== undefined) product.stock -= item.quantity;
          await product.save();
          console.log(`Updated inventory for ${product.title || product.name}: ${oldStock} -> ${oldStock - item.quantity}`);
        }
      }

      res.status(200).json({ message: 'Payment verified successfully', order });
    } else {
      console.error('INVALID SIGNATURE in verifyPayment:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        receivedSignature: razorpay_signature,
        expectedSignature: expectedSign
      });
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('CRITICAL ERROR in verifyPayment:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
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
// @desc    Handle Razorpay Webhooks
// @route   POST /api/orders/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  try {
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (signature === digest) {
      const event = req.body.event;
      console.log('WEBHOOK RECEIVED:', event);

      if (event === 'payment.captured') {
        const payload = req.body.payload.payment.entity;
        const orderId = payload.order_id;
        const paymentId = payload.id;

        // Find the order
        const order = await Order.findOne({ razorpayOrderId: orderId });
        if (order && order.paymentStatus === 'pending') {
          console.log(`WEBHOOK LOG: Updating order ${order._id} to PAID via webhook`);
          
          // IDEMPOTENCY CHECK
          const existingPayment = await Order.findOne({ razorpayPaymentId: paymentId });
          if (existingPayment) {
             return res.status(200).json({ status: 'ok' });
          }

          order.paymentStatus = 'paid';
          order.razorpayPaymentId = paymentId;
          await order.save();

          // Update product inventory
          for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
              if (product.inventory !== undefined) product.inventory -= item.quantity;
              if (product.stock !== undefined) product.stock -= item.quantity;
              await product.save();
            }
          }
        }
      } else if (event === 'payment.failed') {
        const payload = req.body.payload.payment.entity;
        const orderId = payload.order_id;
        
        const order = await Order.findOne({ razorpayOrderId: orderId });
        if (order && order.paymentStatus === 'pending') {
          order.paymentStatus = 'failed';
          await order.save();
          console.log(`WEBHOOK LOG: Marked order ${order._id} as FAILED via webhook`);
        }
      }

      res.status(200).json({ status: 'ok' });
    } else {
      console.error('WEBHOOK ERROR: Invalid signature');
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('WEBHOOK CRITICAL ERROR:', error);
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
    
    // Only fail if still pending
    if (order.paymentStatus === 'pending') {
      order.paymentStatus = 'failed';
      await order.save();
    }
    
    res.json({ message: 'Order marked as failed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
