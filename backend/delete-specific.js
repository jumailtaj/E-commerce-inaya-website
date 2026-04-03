const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const Order = require('./models/order');

async function deleteSpecificOrders() {
  try {
    console.log("Connecting...");
    await mongoose.connect(process.env.MONGO_URI);
    
    const result = await Order.deleteMany({
      $or: [
        { orderNumber: 'INY-1775215610961-699' },
        { "shippingAddress.email": 'jumailtah2005@gmail.com' },
        { "user.email": 'jumailtah2005@gmail.com' },
        { "user.email": 'jumailtaj2005@gmail.com' } // Adding a common variant
      ]
    });

    console.log(`DELETED ${result.deletedCount} SPECIFIC DUMMY ORDERS.`);
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

deleteSpecificOrders();
