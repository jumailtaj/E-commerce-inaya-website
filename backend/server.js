const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();

// Middleware
app.use(compression());

// Request logging for Railway debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.includes('/webhook')) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working" });
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { logout } = require("./controllers/userController");
const { protect } = require("./middleware/authMiddleware");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.post("/api/auth/logout", protect, logout);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle Multer errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: 'File too large. Maximum limit is 5MB',
      error: err.message 
    });
  }

  res.status(err.status || 500).json({ 
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
});

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});