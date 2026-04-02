const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = 'admin';
    const password = 'admin';
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user) {
      console.log("User 'admin' found. Updating password and role...");
      user.password = hashedPassword;
      user.role = 'admin';
      await user.save();
      console.log("User 'admin' updated successfully.");
    } else {
      console.log("User 'admin' not found. Creating new admin user...");
      await User.create({
        name: 'System Admin',
        email: email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log("User 'admin' created successfully with role 'admin'.");
    }

    // Also update jumailtah2005@gmail.com just in case
    let otherAdmin = await User.findOne({ email: 'jumailtah2005@gmail.com' });
    if (otherAdmin) {
        otherAdmin.role = 'admin';
        await otherAdmin.save();
        console.log("User 'jumailtah2005@gmail.com' ensured as admin.");
    }

    console.log("DONE.");
    process.exit(0);
  } catch (err) {
    console.error("FIX FAILED:", err);
    process.exit(1);
  }
}

fixAdmin();
