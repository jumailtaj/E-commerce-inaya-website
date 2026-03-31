const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function debugUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'jumailtah2005@gmail.com' });
    if (user) {
      console.log("User found:", { email: user.email, role: user.role, passwordHash: user.password });
    } else {
      console.log("User jumailtah2005@gmail.com not found in DB.");
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
debugUser();
