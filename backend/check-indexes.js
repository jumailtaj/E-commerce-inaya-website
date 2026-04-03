const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const Order = require('./models/order');

async function checkIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("CONNECTED.");

    const indexes = await Order.collection.listIndexes().toArray();
    console.log("CURRENT INDEXES:");
    console.log(JSON.stringify(indexes, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

checkIndexes();
