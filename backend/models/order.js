const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: String,   // Snapshot
      price: Number,  // Snapshot
      image: String,  // Snapshot
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    fullName: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  paymentStatus: {
    type: String, // Mirror for easy display
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }
}, { timestamps: true });

// Pre-save to generate a human-unique Order ID (e.g. INY-1712034567-456)
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'INY-' + Date.now() + '-' + Math.floor(Math.random() * 900 + 100);
  }
  
  // Initialize statusHistory if empty
  if (this.isNew && this.orderStatus) {
    this.statusHistory.push({ status: this.orderStatus });
  }
  
  next();
});

orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
