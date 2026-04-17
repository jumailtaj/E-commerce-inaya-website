import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Upload, Pencil, Trash2, Plus, LayoutDashboard, ShoppingBag, Package, TrendingUp, CheckCircle, Clock, Eye, X, MapPin, CreditCard, User } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axios';

export function AdminPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeStatusTab, setActiveStatusTab] = useState('placed');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    type: '',
    image: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      toast.error('Admin access required');
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === 'products') fetchProducts();
      if (activeTab === 'orders') fetchOrders();
    }
  }, [user, activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      const productsList = response.data.products || (Array.isArray(response.data) ? response.data : []);
      setProducts(productsList);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order set to ${newStatus}`);
      fetchOrders(); // Refresh list
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Update failed';
      toast.error(errorMsg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !formData.image) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('inventory', formData.stock);
    data.append('type', formData.type);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingId) await api.put(`/products/${editingId}`, data);
      else await api.post('/products', data);
      toast.success(editingId ? 'Product updated' : 'Product added');
      resetForm();
      fetchProducts();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Save failed';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', stock: '', type: '', image: null });
    setPreview(null);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.inventory,
      type: product.category || product.type || '',
      image: null
    });
    setPreview(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      fetchProducts();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Delete failed';
      toast.error(errorMsg);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'processing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'placed': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const orderStatuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  const filteredOrders = Array.isArray(orders) 
    ? orders.filter(o => o.orderStatus === activeStatusTab)
    : [];

  const getStatusCount = (status) => {
    return Array.isArray(orders) ? orders.filter(o => o.orderStatus === status).length : 0;
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Verifying admin...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full shadow-sm z-10">
        <div className="p-6">
          <h1 className="text-2xl font-serif text-pink-600 font-bold">Inaya Store</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Management Suite</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => { setActiveTab('products'); setSelectedOrder(null); }}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-sm transition-all ${activeTab === 'products' ? 'bg-pink-50 text-pink-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Package className="w-5 h-5 mr-3" />
            Product Catalog
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-sm transition-all ${activeTab === 'orders' ? 'bg-pink-50 text-pink-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ShoppingBag className="w-5 h-5 mr-3" />
            Orders Management
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center p-3 rounded-sm bg-gray-50">
            <div className="w-8 h-8 rounded-sm bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs">
              {user.name?.[0] || 'A'}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
            <button 
              onClick={() => { logout(); navigate('/admin/login'); }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-serif text-gray-900 capitalize font-medium">{activeTab} Panel</h2>
            <p className="text-gray-500 mt-1">Manage your store operations and real-time data.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white rounded-sm shadow-sm border border-gray-100 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Live Status</p>
                <p className="text-sm font-bold text-gray-900">System Online</p>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add/Edit Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Item'}</h3>
                  {editingId && (
                    <button onClick={resetForm} className="text-xs text-pink-600 font-bold flex items-center">
                      <Plus className="w-3 h-3 mr-1" /> Create Brand New
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Title</Label>
                    <Input 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      required 
                      className="rounded-sm border-gray-200 focus:ring-pink-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Description</Label>
                    <Textarea 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      required 
                      className="rounded-sm border-gray-200 focus:ring-pink-200 min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Price (₹)</Label>
                      <Input value={formData.price} type="number" onChange={(e)=>setFormData({...formData, price:e.target.value})} required className="rounded-sm border-gray-200" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Stock</Label>
                      <Input value={formData.stock} type="number" onChange={(e)=>setFormData({...formData, stock:e.target.value})} required className="rounded-sm border-gray-200" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Category</Label>
                    <Select value={formData.type} onValueChange={(v)=>setFormData({...formData, type:v})} required>
                      <SelectTrigger className="rounded-sm border-gray-200"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent className="bg-white">
                        {['Hair pin','Banana clips','Clutches','Clips','Hair band','Party wear','Centre clip'].map(t=>(
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-400 uppercase ml-1">Product Visual</Label>
                    <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition-all overflow-hidden relative group">
                      {preview ? (
                        <img src={preview} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Upload Image</p>
                        </div>
                      )}
                      <input type="file" onChange={handleImageChange} className="hidden" />
                      {preview && <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Pencil className="w-5 h-5 text-white" /></div>}
                    </label>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full rounded-sm bg-pink-600 hover:bg-pink-700 text-white font-bold h-12">
                    {isSubmitting ? 'Syncing...' : (editingId ? 'Update Product' : 'Add to Collection')}
                  </Button>
                </form>
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Live Catalog</h3>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-sm font-bold uppercase">{products.length} Items</span>
                </div>
                
                {loading ? (
                  <div className="p-20 text-center text-pink-500 animate-pulse">Loading items...</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {products.map((p) => (
                      <div key={p._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center group">
                        <div className="w-16 h-16 rounded-sm overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                          <img src={p.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">{p.title}</h4>
                          <p className="text-xs text-gray-400 font-medium">₹{p.price} • {p.category || p.type}</p>
                        </div>
                        <div className="text-right mr-6">
                           <p className="text-[10px] text-gray-400 uppercase font-bold">Stock</p>
                           <p className={`text-sm font-bold ${p.inventory < 5 ? 'text-red-500' : 'text-gray-900'}`}>{p.inventory || p.stock}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 relative">
            {/* Pipeline Tabs */}
            <div className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide ${selectedOrder ? 'hidden' : 'flex'}`}>
              {orderStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveStatusTab(status)}
                  className={`px-6 py-3 rounded-sm whitespace-nowrap text-xs font-bold uppercase transition-all border ${
                    activeStatusTab === status 
                    ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-100' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-pink-200 hover:text-pink-600'
                  }`}
                >
                  {status}
                  <span className={`ml-2 px-2 py-0.5 rounded-sm text-[10px] ${
                    activeStatusTab === status ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {getStatusCount(status)}
                  </span>
                </button>
              ))}
            </div>

            <div className={`bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden ${selectedOrder ? 'hidden' : 'block'}`}>
               <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 capitalize">{activeStatusTab} Orders</h3>
                  <p className="text-xs text-gray-400">Total: {filteredOrders.length}</p>
               </div>

               {loading ? (
                 <div className="p-20 text-center text-pink-500">Syncing orders...</div>
               ) : filteredOrders.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                          <th className="px-6 py-4">Order ID & Date</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Items</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4 text-right">Update Stage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map((o) => (
                        <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5">
                            <span className="block text-xs font-bold text-gray-900">{o.orderNumber || o._id.slice(-8).toUpperCase()}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{new Date(o.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-5 text-sm font-medium text-gray-900">
                             {o.user?.name || o.shippingAddress?.fullName}
                             <span className="block text-[10px] text-gray-400">{o.user?.email || o.shippingAddress?.phone}</span>
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex -space-x-2">
                               {o.items?.slice(0, 3).map((item, i) => (
                                 <img key={i} src={item.image} className="w-7 h-7 rounded-sm border-2 border-white object-cover shadow-sm bg-gray-100" />
                               ))}
                               {o.items?.length > 3 && (
                                 <div className="w-7 h-7 rounded-sm border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400 shadow-sm">+{o.items.length - 3}</div>
                               )}
                             </div>
                          </td>
                          <td className="px-6 py-5 text-sm font-bold text-gray-900">₹{o.totalAmount}</td>
                          <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                             <button 
                               onClick={() => setSelectedOrder(o)}
                               className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-sm transition-all"
                               title="View Detail"
                             >
                                <Eye className="w-5 h-5" />
                             </button>
                             
                             {/* FSM Buttons */}
                             {o.orderStatus === 'placed' && (
                               <div className="flex gap-2">
                                 <button onClick={() => handleStatusUpdate(o._id, 'processing')} className="px-3 py-1.5 bg-pink-50 text-pink-600 rounded-sm text-[10px] font-bold uppercase hover:bg-pink-100 transition-colors">Process</button>
                                 <button onClick={() => handleStatusUpdate(o._id, 'cancelled')} className="px-3 py-1.5 bg-gray-50 text-gray-400 rounded-sm text-[10px] font-bold uppercase hover:bg-red-50 hover:text-red-500 transition-colors">Cancel</button>
                               </div>
                             )}
                             {o.orderStatus === 'processing' && (
                               <div className="flex gap-2">
                                 <button onClick={() => handleStatusUpdate(o._id, 'shipped')} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-sm text-[10px] font-bold uppercase hover:bg-blue-100 transition-colors">Ship Order</button>
                                 <button onClick={() => handleStatusUpdate(o._id, 'cancelled')} className="px-3 py-1.5 bg-gray-50 text-gray-400 rounded-sm text-[10px] font-bold uppercase hover:bg-red-50 hover:text-red-500 transition-colors">Cancel</button>
                               </div>
                             )}
                             {o.orderStatus === 'shipped' && (
                               <button onClick={() => handleStatusUpdate(o._id, 'delivered')} className="px-3 py-1.5 bg-green-50 text-green-600 rounded-sm text-[10px] font-bold uppercase hover:bg-green-100 transition-colors">Mark Delivered</button>
                             )}
                             {(o.orderStatus === 'delivered' || o.orderStatus === 'cancelled') && (
                               <span className="text-[10px] text-gray-300 font-bold uppercase mr-2">Archive</span>
                             )}
                          </td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               ) : (
                 <div className="p-20 text-center text-gray-400">No {activeStatusTab} orders yet.</div>
               )}
            </div>

            {/* Detail View Section */}
            {selectedOrder && (
              <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-900 text-white">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-sm transition-colors">
                       <X className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="font-bold">Order Details</h3>
                      <p className="text-[10px] opacity-70 uppercase tracking-widest">{selectedOrder.orderNumber}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-1 rounded-sm text-[10px] font-bold uppercase border ${getStatusColor(selectedOrder.orderStatus)} border-opacity-20`}>
                    {selectedOrder.orderStatus}
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left Column: Line Items */}
                  <div className="lg:col-span-2 space-y-8">
                     <div>
                       <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                         <Package className="w-4 h-4 mr-2" /> Line Items
                       </h4>
                       <div className="bg-gray-50 rounded-sm p-4 divide-y divide-gray-100">
                         {selectedOrder.items?.map((item, idx) => (
                           <div key={idx} className="py-4 flex items-center">
                              <img src={item.image} className="w-16 h-16 rounded-sm object-cover bg-white" />
                              <div className="ml-4 flex-1">
                                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">₹{item.price} x {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                              </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     <div className="flex justify-between items-center p-6 bg-pink-50 rounded-sm border border-pink-100">
                        <span className="text-sm font-bold text-pink-900 uppercase">Total Transaction Value</span>
                        <span className="text-2xl font-serif font-bold text-pink-600">₹{selectedOrder.totalAmount}</span>
                     </div>
                  </div>

                  {/* Right Column: Customer/Shipping/Payment */}
                  <div className="space-y-8">
                    {/* Customer */}
                     <div className="p-6 bg-white rounded-sm border border-gray-100 shadow-sm">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                         <User className="w-4 h-4 mr-2" /> Customer Info
                      </h4>
                      <p className="text-sm font-bold text-gray-900">{selectedOrder.user?.name || selectedOrder.shippingAddress?.fullName}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{selectedOrder.user?.mobile || selectedOrder.shippingAddress?.phone}</p>
                    </div>

                    {/* Shipping */}
                    <div className="p-6 bg-white rounded-sm border border-gray-100 shadow-sm">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                         <MapPin className="w-4 h-4 mr-2" /> Shipping Target
                      </h4>
                      <div className="text-xs text-gray-700 leading-relaxed">
                        <p className="font-bold">{selectedOrder.shippingAddress?.fullName}</p>
                        <p>{selectedOrder.shippingAddress?.addressLine}</p>
                        <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                        <p className="font-mono">{selectedOrder.shippingAddress?.pincode}</p>
                        <p className="mt-2 text-gray-400">Phone: {selectedOrder.shippingAddress?.phone}</p>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="p-6 bg-white rounded-sm border border-gray-100 shadow-sm">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                         <CreditCard className="w-4 h-4 mr-2" /> Payment Logic
                      </h4>
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-bold text-gray-400">Gateway Status</span>
                         <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-50 text-green-600 border border-green-100">Paid</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Reference: <span className="font-mono text-gray-900">{selectedOrder.payment?.razorpay_payment_id || 'N/A'}</span></p>
                    </div>

                    {/* Quick Update */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Process Order</p>
                      <div className="flex flex-col gap-2">
                         {selectedOrder.orderStatus === 'placed' && (
                           <>
                            <Button onClick={() => handleStatusUpdate(selectedOrder._id, 'processing')} className="w-full h-12 rounded-sm bg-pink-600 text-white font-bold">Move to Processing</Button>
                            <Button variant="outline" onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')} className="w-full h-12 rounded-sm border-gray-200 text-gray-500 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100">Cancel Order</Button>
                           </>
                         )}
                         {selectedOrder.orderStatus === 'processing' && (
                           <>
                            <Button onClick={() => handleStatusUpdate(selectedOrder._id, 'shipped')} className="w-full h-12 rounded-sm bg-blue-600 text-white font-bold">Ship Order</Button>
                            <Button variant="outline" onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')} className="w-full h-12 rounded-sm border-gray-200 text-gray-500 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100">Cancel Order</Button>
                           </>
                         )}
                         {selectedOrder.orderStatus === 'shipped' && (
                            <Button onClick={() => handleStatusUpdate(selectedOrder._id, 'delivered')} className="w-full h-12 rounded-sm bg-green-600 text-white font-bold">Mark as Delivered</Button>
                         )}
                         {(selectedOrder.orderStatus === 'delivered' || selectedOrder.orderStatus === 'cancelled') && (
                            <div className="p-4 bg-gray-50 rounded-sm text-center text-xs font-bold text-gray-400 uppercase">This transaction is completed</div>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
