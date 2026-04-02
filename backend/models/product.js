const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String, // Human-friendly backup name
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number, // Special offer price
  },
  inventory: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number, // Backup for inventory
    default: 0
  },
  image: {
    type: String,
    required: true, // Primary image
  },
  images: [{ type: String }], // Gallery images
  category: {
    type: String, // Or Ref: Category model
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
  subCategory: String,
  brand: {
    type: String,
    default: 'Inaya'
  },
  sku: { 
    type: String, 
    unique: true, 
    sparse: true // Allow null for old products
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true // Soft delete toggle
  },
  tags: [{ type: String }],
}, { timestamps: true });

// Pre-save to sync 'name' with 'title'
productSchema.pre('save', function(next) {
  if (this.title && !this.name) this.name = this.title;
  next();
});

productSchema.index({ title: 'text', name: 'text', category: 'text' });
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
