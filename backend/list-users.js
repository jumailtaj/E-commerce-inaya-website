const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}).select('email role');
    console.log("Existing Users:", JSON.stringify(users, null, 2));
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
listUsers();
