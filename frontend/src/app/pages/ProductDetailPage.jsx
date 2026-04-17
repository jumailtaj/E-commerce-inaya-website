import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
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
      setLoading(true);
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
        toast.error(error.response?.data?.message || 'Failed to fetch product details');
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
      const productType = product.type || product.category;
      if (!productType) return;

      setSimilarLoading(true);
      try {
        const response = await api.get('/products', {
          params: { type: productType, limit: 10 }
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
        <div className="animate-spin rounded-sm h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-800 mb-4">Product not found</h2>
          <Button onClick={() => navigate('/')} variant="outline" className="rounded-sm px-8">
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
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>{product.title || product.name} — Inaya</title>
        <meta name="description" content={`Shop ${product.title || product.name} at Inaya. ${product.description?.slice(0, 120)}...`} />
        <meta property="og:title" content={`${product.title || product.name} — Inaya`} />
        <meta property="og:description" content={`Shop ${product.title || product.name} at Inaya. Premium hair accessories delivered across India.`} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://inayastore.vercel.app/product/${product._id || product.id}`} />
      </Helmet>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-pink-600 mb-8 transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>

        {/* Product Layout - Strict 45/55 Split */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-12">

          {/* LEFT: Image Section (45% Width on Desktop) */}
          <div className="lg:w-[45%] flex flex-col md:flex-row gap-4">

            {/* Desktop Thumbnails (Vertical on the LEFT) */}
            {images.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 w-[80px] shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-[70px] h-[70px] rounded-sm overflow-hidden border-2 transition-all hover:scale-105 ${selectedImage === img
                        ? 'border-pink-500 shadow-md ring-2 ring-pink-50'
                        : 'border-gray-100 hover:border-pink-200'
                      }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }} />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image View - Centered and Constrained */}
            <div className="flex-1 bg-white rounded-sm overflow-hidden border border-gray-100 relative group shadow-sm flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={selectedImage || '/placeholder.png'}
                  alt={product.title || product.name}
                  className="max-w-full max-h-[500px] w-auto h-auto object-contain transition-all duration-500 group-hover:scale-[1.02]"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                />
              </div>
            </div>

            {/* Mobile/Tablet Thumbnails (Horizontal ABOVE details, BELOW main image) */}
            {images.length > 1 && (
              <div className="flex md:hidden gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 w-16 shrink-0 rounded-sm overflow-hidden border-2 transition-all ${selectedImage === img
                        ? 'border-pink-500 shadow-md scale-105'
                        : 'border-gray-100'
                      }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details Info (55% Width on Desktop) */}
          <div className="lg:w-[55%] flex flex-col pt-2 lg:pt-0">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-pink-50 text-pink-600 rounded-sm text-[11px] font-bold uppercase tracking-wider mb-4 border border-pink-100">
                {product.type || product.category}
              </span>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3 tracking-tight">
                {product.title || product.name}
              </h1>
              <div className="flex items-center gap-4 py-2">
                <span className="text-3xl font-extrabold text-pink-600">₹{Number(product.price).toFixed(2)}</span>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 line-through">₹{(Number(product.price) * 1.25).toFixed(2)}</span>
                  <span className="text-xs text-green-600 font-semibold">25% OFF</span>
                </div>
              </div>
            </div>

            <div className="prose prose-sm prose-pink max-w-none text-gray-600 mb-8 leading-relaxed">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>

            <div className="space-y-4 mb-10 border-t border-gray-50 pt-8">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-sm shadow-sm ${(product.inventory || product.stock) > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {(product.inventory || product.stock) > 10
                    ? 'In Stock & Ready to Ship'
                    : (product.inventory || product.stock) > 0
                      ? `Limited Stock: Only ${product.inventory || product.stock} pieces left`
                      : 'Out of Stock'}
                </span>
              </div>
              <p className="text-xs text-gray-400">Usually ships within 24-48 hours. Free delivery on orders above ₹500.</p>
            </div>

            <div className="space-y-8">
              {/* Quantity Selection */}
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block">Quantity</span>
                <div className="inline-flex items-center p-1 bg-gray-50 rounded-sm border border-gray-100 transition-colors focus-within:border-pink-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-11 w-11 rounded-sm text-gray-500 hover:bg-white hover:text-pink-600 active:scale-90 transition-all shadow-none"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-bold text-gray-900 text-base">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.inventory || product.stock, quantity + 1))}
                    className="h-11 w-11 rounded-sm text-gray-500 hover:bg-white hover:text-pink-600 active:scale-90 transition-all shadow-none"
                    disabled={quantity >= (product.inventory || product.stock)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 h-12 rounded-sm border-2 border-pink-100 text-pink-600 font-bold text-base hover:bg-pink-50 hover:border-pink-200 transition-all"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 h-12 rounded-sm bg-pink-600 font-bold text-base hover:bg-pink-700 text-white shadow-lg shadow-pink-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {(similarLoading || similarProducts.length > 0) && (
          <div className="mt-12 border-t border-gray-50 pt-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">More in this Type</h2>
              <div className="h-px flex-1 bg-gray-100 ml-6 hidden sm:block"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-sm overflow-hidden shadow-sm animate-pulse">
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
