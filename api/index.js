const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('../routes/authRoutes');
const productRoutes = require('../routes/productRoutes');
const orderRoutes = require('../routes/orderRoutes');

const app = express();

// Middleware
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Static for local uploads (Vercel won't persist this)
app.use('/uploads', express.static('uploads'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER_ERROR:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'An unexpected server error occurred',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});

// Catch-all for API 404s
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
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

// For serverless functions, we connect on each request or use a cached connection
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

module.exports = app;
