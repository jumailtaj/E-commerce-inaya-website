import api from '../../api/axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Package, Calendar, MapPin, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

export function OrderHistoryPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

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
        <div className="animate-spin rounded-sm h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
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
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchOrders(true)} 
              disabled={refreshing}
              className="rounded-sm border-pink-100 text-pink-600 hover:bg-pink-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="bg-white text-pink-600 border-pink-100 rounded-sm px-4 py-1.5 shadow-sm">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </Badge>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-sm p-12 text-center shadow-sm border border-pink-50">
            <div className="bg-pink-50 w-20 h-20 rounded-sm flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-pink-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No orders yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Explore our beautiful collection and find something special to elevate your style!</p>
            <Button onClick={() => navigate('/')} className="bg-pink-600 hover:bg-pink-700 text-white rounded-sm px-10 h-12 shadow-lg shadow-pink-100 transition-all">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="bg-gray-50/50 flex flex-row items-center justify-between border-b border-pink-50 p-5">
                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Order Placed</p>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Total</p>
                      <p className="text-sm font-bold text-pink-600">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Ship to</p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </div>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Order ID</p>
                    <p className="text-[10px] font-mono font-medium text-gray-400">#{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Status Badges */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-sm border text-[11px] font-bold uppercase tracking-wider ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-50 border-green-100 text-green-600' 
                        : 'bg-yellow-50 border-yellow-100 text-yellow-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-sm ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      {order.paymentStatus}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-sm bg-pink-50 border border-pink-100 text-pink-600 text-[11px] font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-sm bg-pink-500" />
                      {order.orderStatus}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-sm overflow-hidden bg-pink-50 border border-pink-50 flex-shrink-0">
                          <img
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-sm border border-pink-50"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                        />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium text-pink-600">₹{item.price.toFixed(2)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-pink-200 hover:text-pink-600 hover:bg-pink-50 rounded-sm"
                          onClick={() => navigate(`/product/${item.product}`)}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6 bg-pink-50" />
                  
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" size="sm" className="rounded-sm border-pink-100 text-pink-600 hover:bg-pink-50 h-9">
                      Download Invoice
                    </Button>
                    <Button size="sm" className="rounded-sm bg-pink-600 hover:bg-pink-700 h-9">
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
