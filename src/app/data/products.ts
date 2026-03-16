export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Pink Pearl Hair Clip",
    price: 24.99,
    description: "Elegant pink pearl hair clip perfect for special occasions. Handcrafted with high-quality materials for lasting beauty.",
    image: "https://images.unsplash.com/photo-1769007069886-153ab38ccc4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwY2xpcCUyMGFjY2Vzc29yeSUyMHBpbmt8ZW58MXx8fHwxNzczNjI3NjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 15
  },
  {
    id: "2",
    name: "Classic Pearl Barrette",
    price: 29.99,
    description: "Timeless pearl barrette that adds sophistication to any hairstyle. Features lustrous pearls arranged in an elegant design.",
    image: "https://images.unsplash.com/photo-1772698262260-8cd0f41a83a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGhhaXIlMjBjbGlwJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzM2Mjc2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 20
  },
  {
    id: "3",
    name: "Gold Butterfly Clip",
    price: 19.99,
    description: "Delicate gold butterfly design brings a touch of whimsy to your look. Perfect for everyday wear or special events.",
    image: "https://images.unsplash.com/photo-1606153372339-2147fe88c097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXJmbHklMjBoYWlyJTIwY2xpcCUyMGdvbGR8ZW58MXx8fHwxNzczNjI3NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 12
  },
  {
    id: "4",
    name: "Modern Claw Clip",
    price: 16.99,
    description: "Contemporary claw clip in a sleek design. Strong hold for all hair types while looking effortlessly chic.",
    image: "https://images.unsplash.com/photo-1730871082904-75d36d9d93fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGF3JTIwaGFpciUyMGNsaXAlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzczNjI3NjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 25
  },
  {
    id: "5",
    name: "Floral Garden Clip",
    price: 22.99,
    description: "Beautiful floral-inspired hair clip adorned with delicate flower details. Adds a romantic touch to any outfit.",
    image: "https://images.unsplash.com/photo-1759816660165-fc43d6578474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBoYWlyJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzczNjI3NjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 18
  },
  {
    id: "6",
    name: "Minimalist Barrette Set",
    price: 14.99,
    description: "Set of sleek minimalist barrettes perfect for creating polished hairstyles. Versatile and easy to use.",
    image: "https://images.unsplash.com/photo-1571565112616-eb30fab8bcf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaGFpciUyMGJhcnJldHRlfGVufDF8fHx8MTc3MzYyNzY0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 30
  },
  {
    id: "7",
    name: "Rhinestone Sparkle Clip",
    price: 27.99,
    description: "Dazzling rhinestone hair clip that catches the light beautifully. Perfect for weddings and formal events.",
    image: "https://images.unsplash.com/photo-1593243981113-1305c276ab85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaGluZXN0b25lJTIwaGFpciUyMGNsaXAlMjBzcGFya2xlfGVufDF8fHx8MTc3MzYyNzY0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 10
  },
  {
    id: "8",
    name: "Velvet Bow Clip",
    price: 18.99,
    description: "Luxurious velvet bow hair clip in soft, rich colors. Adds texture and elegance to your hairstyle.",
    image: "https://images.unsplash.com/photo-1715220210514-5b52d4893f65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWx2ZXQlMjBoYWlyJTIwYm93JTIwY2xpcHxlbnwxfHx8fDE3NzM2Mjc2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 22
  },
  {
    id: "9",
    name: "Vintage Tortoiseshell",
    price: 21.99,
    description: "Classic tortoiseshell hair clip with timeless appeal. Sturdy construction with a vintage-inspired aesthetic.",
    image: "https://images.unsplash.com/photo-1565044149284-1585599a1997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3J0b2lzZXNoZWxsJTIwaGFpciUyMGNsaXAlMjB2aW50YWdlfGVufDF8fHx8MTc3MzYyNzY0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 16
  },
  {
    id: "10",
    name: "Crystal Hair Pin",
    price: 32.99,
    description: "Delicate crystal hair pin that sparkles with every movement. A stunning accessory for sophisticated styling.",
    image: "https://images.unsplash.com/photo-1607638429423-485e2dda4167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlzdGFsJTIwaGFpciUyMHBpbiUyMGRlbGljYXRlfGVufDF8fHx8MTc3MzYyNzY0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 8
  }
];
