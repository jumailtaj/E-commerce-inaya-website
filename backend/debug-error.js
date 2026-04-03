const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const Order = require('./models/order');

async function debugUpdate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // Find the latest order
    const order = await Order.findOne({}).sort({ createdAt: -1 });
    if (!order) {
      console.log("No orders found to test.");
      process.exit(0);
    }

    console.log(`Attempting to update status for order: ${order._id} (OrderNumber: ${order.orderNumber})...`);
    
    // Simulate the admin action
    order.orderStatus = "processing"; 
    
    try {
      await order.save();
      console.log("SUCCESS: Order updated successfully in script.");
    } catch (saveError) {
      console.error("\nCRITICAL FAILURE on order.save():");
      console.error("Code:", saveError.code);
      console.error("Message:", saveError.message);
      if (saveError.errors) {
        console.error("Validation Errors:", JSON.stringify(saveError.errors, null, 2));
      }
    }

    process.exit(0);
  } catch (err) {
    console.error("GENERAL ERROR:", err.message);
    process.exit(1);
  }
}

debugUpdate();
