const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

async function restoreAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find the account with the typo
    const existingUser = await User.findOne({ email: 'jumailtaj2005@gmail.com' });
    
    if (existingUser) {
      console.log("Found existing user with typo. Promoting and renaming...");
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('2202353', salt);
      
      existingUser.email = 'jumailtah2005@gmail.com'; 
      existingUser.password = hashedPassword;
      existingUser.role = 'admin';
      
      await existingUser.save();
      console.log("SUCCESS: Account jumailtah2005@gmail.com is now an ADMIN with password '2202353'");
    } else {
      console.log("Account jumailtaj2005@gmail.com not found. Checking if jumailtah2005@gmail.com exists...");
      const alreadyFixed = await User.findOne({ email: 'jumailtah2005@gmail.com' });
      if (alreadyFixed) {
          console.log("Account jumailtah2005@gmail.com already exists. Updating to ADMIN...");
          const salt = await bcrypt.genSalt(10);
          alreadyFixed.password = await bcrypt.hash('2202353', salt);
          alreadyFixed.role = 'admin';
          await alreadyFixed.save();
          console.log("SUCCESS: Updated existing account to ADMIN.");
      } else {
          console.log("Creating NEW admin account: jumailtah2005@gmail.com");
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('2202353', salt);
          await User.create({
              name: 'Admin',
              email: 'jumailtah2005@gmail.com',
              password: hashedPassword,
              role: 'admin'
          });
          console.log("SUCCESS: Created new ADMIN account.");
      }
    }
    process.exit();
  } catch (err) {
    console.error("RESTORE FAILED:", err);
    process.exit(1);
  }
}
restoreAdmin();
