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
        console.log("API RESPONSE RAW:", response.data);
        
        const productsArray = Array.isArray(response.data?.products)
          ? response.data.products
          : [];

        console.log("EXTRACTED PRODUCTS:", productsArray);
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedType, search]);

  useEffect(() => {
    console.log("FINAL PRODUCTS STATE:", products);
  }, [products]);

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

          <p style={{ color: "red", fontWeight: "bold", marginBottom: "1rem" }}>
            DEBUG - Count: {Array.isArray(products) ? products.length : "NOT ARRAY"}
          </p>

          <div 
            style={{ border: products.length > 0 ? "none" : "3px solid red" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 min-h-[400px]"
          >
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded-sm overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-square bg-pink-50/50"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-100 rounded-sm w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded-sm w-1/4"></div>
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product, i) => (
                <ProductCard key={product.id || product._id} product={product} priority={i < 4} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-white rounded-sm border-2 border-dashed border-pink-100/50">
                <p className="text-gray-400 font-light italic">No premium accessories found matching your selection.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
