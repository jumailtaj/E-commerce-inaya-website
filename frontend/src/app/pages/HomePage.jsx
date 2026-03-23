import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Hero } from '../components/Hero';
import { products as staticProducts } from '../data/products';
import api from '../../api/axios';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Clips', 'Barrettes', 'Pins'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        const data = await api.get('/products', { params });
        const productsList = data.products || data;
        if (Array.isArray(productsList)) {
          setProducts(productsList);
        } else {
          setProducts(staticProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Hero />
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-serif text-gray-800">Our Products</h2>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
