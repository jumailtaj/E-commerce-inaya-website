const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const Order = require('./models/order');

async function checkValidation() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // Find orders that are missing required fields according to the current schema
    const allOrders = await Order.find({});
    console.log(`TOTAL ORDERS: ${allOrders.length}`);

    let corruptCount = 0;
    for (const order of allOrders) {
      const error = order.validateSync();
      if (error) {
        corruptCount++;
        console.log(`\nCORRUPT ORDER: ${order._id}`);
        console.log("Errors:", JSON.stringify(error.errors, null, 2));
      }
    }

    console.log(`\n\nFINISHED. Found ${corruptCount} orders that violate the current schema validation.`);
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

checkValidation();
