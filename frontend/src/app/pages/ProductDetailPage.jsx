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
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      // First check static products
      const staticProd = staticProducts.find((p) => p.id === id);
      if (staticProd) {
        setProduct(staticProd);
        setSelectedImage(staticProd.image);
        setLoading(false);
        return;
      }

      // If not found, fetch from API
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data) {
          setProduct(response.data);
          setSelectedImage(response.data.image);
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
          <Button onClick={() => navigate('/')} variant="outline" className="rounded-full px-8">
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

  // Prepare images array
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-pink-600 mb-6 transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 mb-20">
          
          {/* LEFT: Image Section (Thumbnails + Main Image) */}
          <div className="md:col-span-7 lg:col-span-7 flex flex-col md:flex-row gap-4">
            
            {/* Desktop Thumbnails (Vertical) */}
            {images.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedImage === img 
                        ? 'border-pink-500 shadow-md scale-105' 
                        : 'border-pink-50 hover:border-pink-200'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image View */}
            <div className="flex-1 bg-pink-50/30 rounded-3xl overflow-hidden border border-pink-50 relative group shadow-sm">
              <div className="aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-square">
                <ImageWithFallback
                  src={selectedImage || product.image}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Mobile Thumbnails (Horizontal) */}
            {images.length > 1 && (
              <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide mt-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img 
                        ? 'border-pink-500 scale-105 shadow-md' 
                        : 'border-pink-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details Info */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col pt-4 md:pt-0">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                {product.type}
              </span>
              <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 leading-tight mb-2">
                {product.title || product.name}
              </h1>
              <div className="flex items-center gap-4 py-4">
                <span className="text-3xl font-bold text-pink-600">₹{Number(product.price).toFixed(2)}</span>
                <span className="text-sm text-gray-400 line-through">₹{(Number(product.price) * 1.25).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-6 mb-8 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>{product.description}</p>
              
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${(product.inventory || product.stock) > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>
                  {(product.inventory || product.stock) > 10 
                    ? 'Available in Stock' 
                    : (product.inventory || product.stock) > 0 
                      ? `Hurry! Only ${product.inventory || product.stock} pieces remaining`
                      : 'Recently Sold Out'}
                </span>
              </div>
            </div>

            <div className="space-y-8 mt-auto">
              {/* Quantity Selection */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Quantity Selection</span>
                <div className="inline-flex items-center p-1 bg-gray-50 rounded-2xl border border-gray-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-xl text-gray-500 hover:bg-white hover:text-pink-600 transition-all shadow-none"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.inventory || product.stock, quantity + 1))}
                    className="h-10 w-10 rounded-xl text-gray-500 hover:bg-white hover:text-pink-600 transition-all shadow-none"
                    disabled={quantity >= (product.inventory || product.stock)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 h-16 rounded-2xl border-2 border-pink-100 text-pink-600 font-bold text-lg hover:bg-pink-50 hover:border-pink-200"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 h-16 rounded-2xl bg-pink-600 font-bold text-lg hover:bg-pink-700 text-white shadow-lg shadow-pink-100 transition-all active:scale-95"
                >
                  Buy Now
                </Button>
              </div>
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
