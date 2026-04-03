const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const Order = require('./models/order');

async function countOrders() {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Order.countDocuments({});
  console.log(`TOTAL REMAINING ORDERS: ${count}`);
  const orders = await Order.find({});
  console.log("ALL REMAINING ORDERS DETAIL:");
  orders.forEach(o => { console.log(` - ID: ${o._id}, OrderNumber: ${o.orderNumber}, Status: ${o.orderStatus}, Email: ${o.shippingAddress?.email || 'N/A'}`); });
  process.exit(0);
}

countOrders();
