const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const Order = require('./models/order');

async function checkData() {
  try {
    console.log("Connecting...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(10);
    console.log("LAST 10 ORDERS:");
    orders.forEach(o => {
      console.log(`ID: ${o._id}, OrderNumber: ${o.orderNumber}, Status: ${o.orderStatus}`);
    });

    const duplicates = await Order.aggregate([
      { $match: { orderNumber: { $ne: null } } },
      { $group: { _id: "$orderNumber", count: { $sum: 1 }, ids: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    if (duplicates.length > 0) {
      console.log("\nFOUND DUPLICATES:");
      console.log(JSON.stringify(duplicates, null, 2));
    } else {
      console.log("\nNO DUPLICATE ORDER NUMBERS FOUND.");
    }

    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

checkData();
