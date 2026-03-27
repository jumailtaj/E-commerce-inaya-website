import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { products as staticProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import api from '../../api/axios';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      // First check static products
      const staticProd = staticProducts.find((p) => p.id === id);
      if (staticProd) {
        setProduct(staticProd);
        setLoading(false);
        return;
      }

      // If not found, fetch from API
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          toast.error('Product data is empty');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        const message = error.response?.data?.message || 'Failed to fetch product details';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    // Scroll to top on id change
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!product?.type) return;
      
      setSimilarLoading(true);
      try {
        const response = await api.get('/products', {
          params: { type: product.type, limit: 10 }
        });
        const productsList = response.data.products || (Array.isArray(response.data) ? response.data : []);
        
        // Filter out current product and limit to 4
        const filtered = productsList
          .filter(p => (p._id || p.id) !== (product._id || product.id))
          .slice(0, 4);
        
        setSimilarProducts(filtered);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setSimilarLoading(false);
      }
    };

    if (product) {
      fetchSimilarProducts();
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-800 mb-4">Product not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.title || product.name} to cart`);
  };

  const handleBuyNow = () => {
    if (product) {
      navigate('/checkout', { state: { product, quantity } });
    }
  };

  const imageUrl = product.image;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            <div className="aspect-square bg-pink-50">
              <ImageWithFallback
                src={imageUrl}
                alt={product.title || product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-serif text-gray-800 mb-3">
              {product.title || product.name}
            </h1>
            
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-semibold">
                {product.type}
              </span>
            </div>

            <p className="text-3xl font-semibold text-pink-600 mb-6">₹{Number(product.price).toFixed(2)}</p>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">
                {(product.inventory || product.stock) > 10 ? 'In Stock' : `Only ${product.inventory || product.stock} left in stock`}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-2">Quantity</label>
              <div className="items-center gap-3 inline-flex bg-white px-3 py-1.5 rounded-full border border-pink-100">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full h-8 w-8 text-pink-600 hover:bg-pink-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.inventory || product.stock, quantity + 1))}
                  className="rounded-full h-8 w-8 text-pink-600 hover:bg-pink-50"
                  disabled={quantity >= (product.inventory || product.stock)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 rounded-full border-pink-300 text-pink-600 hover:bg-pink-50 h-12 text-base font-medium"
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 rounded-full bg-pink-600 hover:bg-pink-700 text-white h-12 text-base font-medium shadow-md transition-all active:scale-95"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {(similarLoading || similarProducts.length > 0) && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-gray-800">More in this Type</h2>
              <div className="h-0.5 flex-1 bg-pink-100 ml-6 hidden sm:block"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="aspect-square bg-gray-100"></div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : (
                similarProducts.map((p) => (
                  <ProductCard key={p._id || p.id} product={p} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
