import api from '../../api/axios';

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [loading, setLoading] = useState(false);

  // Check if it's a "Buy Now" flow or cart flow
  const buyNowItem = location.state?.product ? {
    product: location.state.product,
    quantity: location.state.quantity
  } : null;

  const itemsToCheckout = buyNowItem ? [buyNowItem] : cartItems;
  const totalAmount = buyNowItem 
    ? buyNowItem.product.price * buyNowItem.quantity 
    : getCartTotal();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue to checkout');
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Validate address
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error('Please fill in all shipping details');
      return;
    }

    setLoading(true);

    try {
      // 0. Get Razorpay Key from backend
      const configRes = await api.get('/orders/config/razorpay-key');
      const { keyId } = configRes.data;
      
      console.log('Razorpay Key fetched:', keyId);

      if (!keyId || keyId === 'YOUR_RAZORPAY_KEY_ID') {
        throw new Error('Razorpay Key ID is not configured on the server');
      }

      // 1. Create Order on Backend
      const orderRes = await api.post('/orders/create', {
        items: itemsToCheckout.map(item => ({
          product: item.product._id || item.product.id,
          quantity: item.quantity
        })),
        shippingAddress
      });

      const orderData = orderRes.data;

      // 2. Initialize Razorpay Checkout
      const options = {
        key: keyId, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Inaya E-commerce',
        description: 'Order Payment',
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          try {
            const verifyRes = await api.post('/orders/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.status === 200) {
              toast.success('Payment Successful!');
              if (!buyNowItem) clearCart();
              navigate('/profile', { state: { orderCompleted: true } });
            } else {
              toast.error(verifyRes.data?.message || 'Payment verification failed');
            }
          } catch (err) {
            console.error(err);
            toast.error('Error verifying payment');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: {
          color: '#db2777' // pink-600
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response) {
        toast.error('Payment Failed: ' + response.error.description);
      });

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || error.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-serif text-gray-800 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-white border-b border-pink-100">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Truck className="w-5 h-5 text-pink-500" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    placeholder="123 Main St"
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                    className="focus-visible:ring-pink-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Mumbai"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="focus-visible:ring-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Maharashtra"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="focus-visible:ring-pink-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="400001"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      className="focus-visible:ring-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value="India"
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-white border-b border-pink-100">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-pink-500" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 p-4 border-2 border-pink-100 rounded-xl bg-pink-50/30">
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Secure Payment via Razorpay</h4>
                    <p className="text-sm text-gray-500">Supports UPI, Cards, Netbanking, & Wallets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-md sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {itemsToCheckout.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium line-clamp-1">
                          {item.product.name || item.product.title}
                        </p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-gray-800">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <Separator className="bg-pink-100" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator className="bg-pink-50" />
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-pink-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full rounded-full bg-pink-600 hover:bg-pink-700 text-white text-lg py-6"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
