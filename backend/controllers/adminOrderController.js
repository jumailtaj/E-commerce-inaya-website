const Order = require('../models/order');

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { orderStatus: status } : {};

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get order details for admin
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('payment')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order status with strict FSM transitions
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status: newStatus } = req.body;
  const validStatuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ message: 'Invalid status target' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const currentStatus = order.orderStatus;

    // 1. Definition of valid transitions (FSM Engine)
    const transitionRules = {
      'pending': ['placed', 'cancelled'], // Pending can only move after payment or if timed out/failed
      'placed': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [], // Final State
      'cancelled': []  // Final State
    };

    // 2. Validate move
    const allowed = transitionRules[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({ 
        message: `Invalid transition: Cannot move order from ${currentStatus} to ${newStatus}` 
      });
    }

    // 3. Side Effects: Stock Restoration on Cancellation
    if (newStatus === 'cancelled' && currentStatus !== 'cancelled') {
        const Product = require('../models/product');
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity, inventory: item.quantity }
            });
        }
    }

    // 4. Persistence
    order.orderStatus = newStatus;
    order.statusHistory.push({ status: newStatus });
    await order.save();

    res.json({ message: `Order lifecycle updated to ${newStatus}`, order });
  } catch (error) {
    console.error('[updateOrderStatus]', error.code, error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus
};
