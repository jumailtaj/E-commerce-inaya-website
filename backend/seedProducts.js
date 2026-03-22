const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    name: "Pink Pearl Hair Clip",
    price: 24.99,
    description: "Elegant pink pearl hair clip perfect for special occasions. Handcrafted with high-quality materials for lasting beauty.",
    image: "https://images.unsplash.com/photo-1769007069886-153ab38ccc4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    stock: 15,
    category: "Clips",
    subcategory: "Pearl"
  },
  {
    name: "Classic Pearl Barrette",
    price: 29.99,
    description: "Timeless pearl barrette that adds sophistication to any hairstyle. Features lustrous pearls arranged in an elegant design.",
    image: "https://images.unsplash.com/photo-1772698262260-8cd0f41a83a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    stock: 20,
    category: "Barrettes",
    subcategory: "Pearl"
  },
  {
    name: "Gold Butterfly Clip",
    price: 19.99,
    description: "Delicate gold butterfly design brings a touch of whimsy to your look. Perfect for everyday wear or special events.",
    image: "https://images.unsplash.com/photo-1606153372339-2147fe88c097?q=80&w=1080",
    stock: 12,
    category: "Clips",
    subcategory: "Butterfly"
  },
  {
    name: "Modern Claw Clip",
    price: 16.99,
    description: "Contemporary claw clip in a sleek design. Strong hold for all hair types while looking effortlessly chic.",
    image: "https://images.unsplash.com/photo-1730871082904-75d36d9d93fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    stock: 25,
    category: "Clips",
    subcategory: "Claw"
  },
  {
    name: "Floral Garden Clip",
    price: 22.99,
    description: "Beautiful floral-inspired hair clip adorned with delicate flower details. Adds a romantic touch to any outfit.",
    image: "https://images.unsplash.com/photo-1759816660165-fc43d6578474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    stock: 18,
    category: "Clips",
    subcategory: "Floral"
  },
  {
    name: "Minimalist Barrette Set",
    price: 14.99,
    description: "Set of sleek minimalist barrettes perfect for creating polished hairstyles. Versatile and easy to use.",
    image: "https://images.unsplash.com/photo-1571565112616-eb30fab8bcf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    stock: 30,
    category: "Barrettes",
    subcategory: "Minimalist"
  },
  {
    name: "Rhinestone Sparkle Clip",
    price: 27.99,
    description: "Dazzling rhinestone hair clip that catches the light beautifully. Perfect for weddings and formal events.",
    image: "https://images.unsplash.com/photo-1593243981113-1305c276ab85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    stock: 10,
    category: "Clips",
    subcategory: "Rhinestone"
  },
  {
    name: "Velvet Bow Clip",
    price: 18.99,
    description: "Luxurious velvet bow hair clip in soft, rich colors. Adds texture and elegance to your hairstyle.",
    image: "https://images.unsplash.com/photo-1715220210514-5b52d4893f65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    stock: 22,
    category: "Clips",
    subcategory: "Bow"
  },
  {
    name: "Vintage Tortoiseshell",
    price: 21.99,
    description: "Classic tortoiseshell hair clip with timeless appeal. Sturdy construction with a vintage-inspired aesthetic.",
    image: "https://images.unsplash.com/photo-1565044149284-1585599a1997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    stock: 16,
    category: "Clips",
    subcategory: "Tortoiseshell"
  },
  {
    name: "Crystal Hair Pin",
    price: 32.99,
    description: "Delicate crystal hair pin that sparkles with every movement. A stunning accessory for sophisticated styling.",
    image: "https://images.unsplash.com/photo-1607638429423-485e2dda4167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    stock: 8,
    category: "Pins",
    subcategory: "Crystal"
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    for (const p of products) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        await Product.create(p);
        console.log(`Product created: ${p.name}`);
      } else {
        // Update existing products with category and subcategory if they are missing
        if (!exists.category || !exists.subcategory) {
          exists.category = p.category;
          exists.subcategory = p.subcategory;
          await exists.save();
          console.log(`Product updated with category: ${p.name}`);
        } else {
          console.log(`Product already exists: ${p.name}`);
        }
      }
    }
    
    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedProducts();
