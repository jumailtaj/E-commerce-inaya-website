const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const Order = require('./models/order');

async function cleanupDummyOrders() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // Define what constitutes a "dummy" order
    // 1. Orders with test emails
    // 2. Orders without a real orderNumber (older versions)
    // 3. Orders with paymentStatus 'pending' older than 7 days (failed checkouts)
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await Order.deleteMany({
      $or: [
        { "shippingAddress.email": /test/i },
        { "user.email": /test/i },
        { orderNumber: { $exists: false } },
        { paymentStatus: 'pending', createdAt: { $lt: sevenDaysAgo } }
      ]
    });

    console.log(`Successfully removed ${result.deletedCount} dummy/test orders.`);
    
    // Optional: Reset statusHistory for remaining real orders if they don't have it
    const realOrders = await Order.find({ statusHistory: { $size: 0 } });
    if (realOrders.length > 0) {
        console.log(`Initializing status history for ${realOrders.length} existing orders...`);
        for (const order of realOrders) {
            order.statusHistory.push({ status: order.orderStatus, timestamp: order.createdAt });
            await order.save();
        }
    }

    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err.message);
    process.exit(1);
  }
}

cleanupDummyOrders();
