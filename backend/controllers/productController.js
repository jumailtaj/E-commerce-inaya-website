const Product = require('../models/product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (type) query.category = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

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
  const { title, description, price, inventory, stock, type, category, isFeatured, brand, discountPrice } = req.body;
  let image = '/placeholder.png';

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
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      inventory: Number(inventory || stock || 0),
      stock: Number(stock || inventory || 0),
      image,
      category: category || type, // Map type to category
      brand: brand || 'Inaya',
      isFeatured: isFeatured === 'true' || isFeatured === true,
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
  const { title, description, price, discountPrice, inventory, stock, type, category, isFeatured, brand } = req.body;
  
  let updateData = { 
    title, 
    description, 
    price: price ? Number(price) : undefined, 
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    inventory: inventory ? Number(inventory) : (stock ? Number(stock) : undefined),
    stock: stock ? Number(stock) : (inventory ? Number(inventory) : undefined),
    category: category || type,
    brand,
    isFeatured: isFeatured === 'true' || isFeatured === true,
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

// Get single product
const getProductById = async (req, res) => {
  try {
    console.log('Fetching product by ID:', req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
