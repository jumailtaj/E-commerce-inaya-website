const mongoose = require('mongoose');
const path = require('path');
const envPath = path.resolve(__dirname, '..', 'backend', '.env');
const modelPath = path.resolve(__dirname, '..', 'backend', 'models', 'product');

require("dotenv").config({ path: envPath });
const Product = require(modelPath);

async function checkProducts() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const count = await Product.countDocuments({});
    console.log("TOTAL PRODUCTS IN DB:", count);

    if (count > 0) {
      const sample = await Product.findOne({});
      console.log("SAMPLE PRODUCT:", JSON.stringify(sample, null, 2));
    }

    const categories = await Product.distinct('category');
    console.log("DISTINCT CATEGORIES:", categories);

    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

checkProducts();
