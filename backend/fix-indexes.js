const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const Order = require('./models/order');

async function fixDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.");

    // List existing indexes
    console.log("Checking indexes for the 'orders' collection...");
    const indexes = await Order.collection.listIndexes().toArray();
    console.log("Current indexes:", JSON.stringify(indexes, null, 2));

    const badIndex = indexes.find(idx => idx.name === "orderNumber_1" && !idx.sparse);
    
    if (badIndex) {
      console.log("Found non-sparse unique index 'orderNumber_1'. Dropping it...");
      await Order.collection.dropIndex("orderNumber_1");
      console.log("Index dropped successfully.");
      console.log("Mongoose will automatically recreate it with 'sparse: true' on next server restart.");
    } else {
      console.log("No non-sparse index 'orderNumber_1' found. It may have already been fixed.");
    }

    // Also check for duplicate orderNumbers that might be blocking the new index
    console.log("Checking for duplicate orderNumbers in existing data...");
    const duplicates = await Order.aggregate([
      { $match: { orderNumber: { $ne: null } } },
      { $group: { _id: "$orderNumber", count: { $sum: 1 }, ids: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    if (duplicates.length > 0) {
      console.log("CRITICAL: Found duplicate orderNumbers that will block the unique index!");
      for (const dup of duplicates) {
        console.log(`Duplicate '${dup._id}' found in ${dup.count} orders.`);
        // Note: For safety, we won't auto-delete or auto-change them here unless the user asks.
        // We'll just report them.
      }
      console.log("Please fix these duplicates manually in your DB dashboard or delete the extra orders.");
    } else {
      console.log("No duplicate orderNumbers found.");
    }

    console.log("Finished. You can now restart your backend server.");
    process.exit(0);
  } catch (err) {
    console.error("FAILED to fix DB:", err.message);
    process.exit(1);
  }
}

fixDB();
