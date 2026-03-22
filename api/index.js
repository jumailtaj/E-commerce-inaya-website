const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const serverless = require('serverless-http');
require('dotenv').config();

// Models and Controllers (Importing needed for direct mappings)
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Routes
const authRoutes = require('../routes/authRoutes');
const productRoutes = require('../routes/productRoutes');
const orderRoutes = require('../routes/orderRoutes');

const app = express();

// Middleware
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection helper (Optimized for Serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Ensure DB connection for each request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Normalized Routes (Direct mapping as requested)
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Normalized direct endpoints
app.get("/api/products", productController.getProducts);
app.get("/api/product/:id", productController.getProductById);
app.post("/api/create-order", protect, orderController.createOrder);
app.post("/api/verify-payment", protect, orderController.verifyPayment);

// Standard Router-based Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);

// Static for local uploads (Vercel won't persist this)
app.use('/uploads', express.static('uploads'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    error: "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { message: err.message, stack: err.stack })
  });
});

// Catch-all for API 404s
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export serverless handler
module.exports = serverless(app);
