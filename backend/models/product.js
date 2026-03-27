const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true, // Making optional if 'name' is used
  },
  name: String, // Supporting both
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inventory: {
    type: Number,
    // required: true,
  },
  stock: Number, // Supporting both
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Hair pin',
      'Banana clips',
      'Clutches',
      'Clips',
      'Hair band',
      'Party wear',
      'Centre clip'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ title: 'text', name: 'text', type: 'text' });
productSchema.index({ title: 1, name: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ type: 1 });

module.exports = mongoose.model('Product', productSchema);
