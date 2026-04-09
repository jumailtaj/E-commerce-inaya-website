import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { ProductCard } from '../components/ProductCard';
import { Hero } from '../components/Hero';
import api from '../../api/axios';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const types = [
    'All',
    'Hair pin',
    'Banana clips',
    'Clutches',
    'Clips',
    'Hair band',
    'Party wear',
    'Centre clip'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedType !== 'All') {
          params.type = selectedType;
        }
        if (search) {
          params.search = search;
        }
        const response = await api.get('/products', { params });
        const productsList = response.data.products || (Array.isArray(response.data) ? response.data : null);

        if (productsList && productsList.length > 0) {
          setProducts(productsList);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedType, search]);

  return (
    <>
      <Helmet>
        <title>Inaya — Shop Premium Hair Accessories Online</title>
        <meta name="description" content="Discover Inaya's exclusive collection of premium hair accessories. Elegant clips, stylish bands and more." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Hero />
        <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-serif text-gray-800">Our Products</h2>

            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-all ${selectedType === type
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-100'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded-sm overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-2">
                    <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 w-1/4"></div>
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product, i) => (
                <ProductCard key={product.id || product._id} product={product} priority={i === 0 || i === 1} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-sm border-2 border-dashed border-pink-100">
                <p className="text-gray-400 italic">No products found matching your selection.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
