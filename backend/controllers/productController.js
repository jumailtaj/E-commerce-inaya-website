const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, subcategory } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    const products = await Product.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const { uploadToCloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

// Create a new product
const createProduct = async (req, res) => {
  const { title, description, price, inventory, category, subcategory } = req.body;
  let image = 'https://images.unsplash.com/photo-1606153372339-2147fe88c097?q=80&w=1080';

  try {
    if (req.file) {
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(req.file.path);
      image = cloudinaryUrl;
      
      // Remove temporary file from local uploads folder
      fs.unlinkSync(req.file.path);
    }

    const product = new Product({
      title,
      description,
      price: Number(price),
      inventory: Number(inventory),
      image,
      category,
      subcategory,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message || 'Failed to create product' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, inventory, category, subcategory } = req.body;
  let updateData = { 
    title, 
    description, 
    price: Number(price), 
    inventory: Number(inventory),
    category,
    subcategory
  };

  try {
    if (req.file) {
      // Upload new image to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(req.file.path);
      updateData.image = cloudinaryUrl;
      fs.unlinkSync(req.file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message || 'Failed to update product' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message || 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
