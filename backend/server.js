const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();

const app = express();

// Middleware
app.use(compression());

// Request logging for Railway debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: "https://e-commerce-inaya-website-4qsf.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
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

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});