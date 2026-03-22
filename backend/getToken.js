const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function getToken() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({});
    if (!user) {
      console.error('No user found');
      process.exit(1);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token:', token);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

getToken();
