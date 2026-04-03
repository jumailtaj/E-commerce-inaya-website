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

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allowedStatus = ['pending', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: 'Invalid status transition' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Example validation logic: cannot un-cancel
    if (order.orderStatus === 'cancelled' && status !== 'cancelled') {
        return res.status(400).json({ message: 'Cannot re-open a cancelled order' });
    }

    order.orderStatus = status;
    await order.save();

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    console.error('[updateOrderStatus ERROR]', error.code, error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus
};
