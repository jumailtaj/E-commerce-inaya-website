const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection helper
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

// Connect DB before each request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Import routes
const authRoutes = require("../routes/authRoutes");
const productRoutes = require("../routes/productRoutes");
const orderRoutes = require("../routes/orderRoutes");
const userRoutes = require("../routes/userRoutes");
const cartRoutes = require("../routes/cartRoutes");
const adminRoutes = require("../routes/adminRoutes");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Minimal test route
app.get("/api/test", (req, res) => {
    res.json({ message: "API working" });
});

// Direct endpoints for backward compatibility
app.get("/api/products", productController.getProducts);
app.get("/api/product/:id", productController.getProductById);
app.get("/api/products/:id", productController.getProductById);
app.post("/api/create-order", protect, orderController.createOrder);
app.post("/api/verify-payment", protect, orderController.verifyPayment);

// Router based routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

// Generic error handler for serverless functions
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "API Runtime Error", details: err.message });
});

module.exports = serverless(app);
