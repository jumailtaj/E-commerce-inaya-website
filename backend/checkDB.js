const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({});
    console.log('Products in DB:', JSON.stringify(products, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkProducts();
