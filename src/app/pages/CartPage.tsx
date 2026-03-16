import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...');
    // In a real app, this would navigate to checkout
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some beautiful hair clips to get started!</p>
            <Button
              onClick={() => navigate('/')}
              className="rounded-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif text-gray-800 mb-8">Shopping Cart</h1>

        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl shadow-sm p-4 sm:p-6"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-pink-50 flex-shrink-0">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-800 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-pink-600 mb-3">
                      ${item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-full border-pink-200 hover:bg-pink-50"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-full border-pink-200 hover:bg-pink-50"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-start gap-4">
                    <p className="text-lg text-gray-800">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove from cart"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl text-gray-800">Total</span>
            <span className="text-2xl text-pink-600">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          <Button
            onClick={handleCheckout}
            className="w-full rounded-full bg-pink-600 hover:bg-pink-700 text-white text-lg py-6"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
