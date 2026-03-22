import api from '../../api';

export function OrderHistoryPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };


    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full p-8 text-center shadow-lg border-none">
          <ShoppingBag className="w-16 h-16 text-pink-200 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-gray-800 mb-2">Login to view orders</h2>
          <p className="text-gray-500 mb-6">Please sign in to see your order history and track shipments.</p>
          <Button onClick={() => navigate('/login')} className="w-full bg-pink-600 hover:bg-pink-700">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-gray-800">Your Orders</h1>
            <p className="text-gray-500">Track and manage your recent purchases</p>
          </div>
          <Badge variant="outline" className="bg-white text-pink-600 border-pink-200 px-4 py-1">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </Badge>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center shadow-md border-none bg-white">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Explore our beautiful collection and find something special!</p>
            <Button onClick={() => navigate('/')} variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="bg-pink-50/50 flex flex-row items-center justify-between border-b border-pink-100 p-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order Placed</p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Amount</p>
                      <p className="text-sm font-semibold text-pink-600">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Ship to</p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <MapPin className="w-3.5 h-3.5 text-pink-400" />
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Order #</p>
                    <p className="text-[10px] font-mono text-gray-500">{order.razorpayOrderId}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Status Badges */}
                  <div className="flex gap-2 mb-6">
                    <Badge className={`${
                      order.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    } border-none`}>
                      Payment: {order.paymentStatus.toUpperCase()}
                    </Badge>
                    <Badge className="bg-pink-100 text-pink-700 border-none">
                      Status: {order.orderStatus.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-pink-50 border border-pink-50 flex-shrink-0">
                          <ImageWithFallback
                            src={item.product?.image}
                            alt={item.product?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 line-clamp-1">{item.product?.title}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium text-pink-600">₹{item.price.toFixed(2)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-pink-200 hover:text-pink-600 hover:bg-pink-50 rounded-full"
                          onClick={() => navigate(`/product/${item.product?._id}`)}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6 bg-pink-50" />
                  
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" size="sm" className="rounded-full border-pink-100 text-pink-600 hover:bg-pink-50 h-9">
                      Download Invoice
                    </Button>
                    <Button size="sm" className="rounded-full bg-pink-600 hover:bg-pink-700 h-9">
                      Track Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
