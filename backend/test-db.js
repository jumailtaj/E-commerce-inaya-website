const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const Product = require('./models/product');

dotenv.config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("SUCCESS: Connected to MongoDB");

        const users = await User.find({ email: 'jumailtah2005@gmail.com' });
        console.log("USER SEARCH RESULTS:", JSON.stringify(users, null, 2));

        const products = await Product.find({});
        console.log("TOTAL PRODUCTS IN DB:", products.length);
        if (products.length > 0) {
            console.log("SAMPLE PRODUCT:", JSON.stringify(products[0], null, 2));
        }

        process.exit();
    } catch (err) {
        console.error("DB CONNECTION FAILED:", err);
        process.exit(1);
    }
}

checkDB();
