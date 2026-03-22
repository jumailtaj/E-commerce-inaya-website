import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Upload, Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api';

export function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [adminAuth, setAdminAuth] = useState({ name: '', password: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
    image: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminAuth.name === 'admin' && adminAuth.password === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      toast.success('Admin logged in');
    } else {
      toast.error('Invalid admin credentials');
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
    data.append('category', formData.category);
    data.append('subcategory', formData.subcategory);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = editingId 
        ? await api.put(`/products/${editingId}`, data)
        : await api.post('/products', data);
      
      toast.success(editingId ? 'Product updated successfully!' : 'Product added successfully!');
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error processing product:', error);
      toast.error(error.response?.data?.message || 'Failed to process request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      subcategory: '',
      image: null
    });
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
      category: product.category || '',
      subcategory: product.subcategory || '',
      image: null // We don't prepopulate the image file, but we can show the current one
    });
    setPreview(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
        <form onSubmit={handleAdminLogin} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-pink-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-gray-800 mb-2">Admin Login</h2>
            <p className="text-gray-600 italic font-medium">Please sign in to access the dashboard</p>
          </div>
          <div className="space-y-5">
            <div>
              <Label htmlFor="admin-name">Name</Label>
              <Input 
                id="admin-name"
                value={adminAuth.name} 
                onChange={e => setAdminAuth({...adminAuth, name: e.target.value})} 
                placeholder="admin" 
                required 
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input 
                id="admin-password"
                type="password" 
                value={adminAuth.password} 
                onChange={e => setAdminAuth({...adminAuth, password: e.target.value})} 
                placeholder="admin" 
                required 
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>
            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 rounded-xl shadow-lg transition-all active:scale-95">
              Login as Admin
            </Button>
            <p className="text-center text-xs text-gray-400 mt-4">Demo credentials: admin / admin</p>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              {editingId ? 'Edit existing product' : 'Add new products to your store'}
            </p>
          </div>
          {editingId && (
            <Button 
              onClick={resetForm}
              variant="outline"
              className="rounded-full border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Instead
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Elegant Pearl Hair Clip"
                required
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the product features, materials, and style..."
                rows={4}
                required
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="24.99"
                required
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                required
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Clips"
                  required
                  className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
                />
              </div>

              {/* Subcategory */}
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="e.g., Pearl"
                  required
                  className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image">Product Image</Label>
              <div className="mt-1">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full min-h-40 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer bg-pink-50 hover:bg-pink-100 transition-colors overflow-hidden"
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-40 object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <Upload className="w-10 h-10 text-pink-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-600">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
                    </div>
                  )}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {formData.image.name}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-pink-600 hover:bg-pink-700 text-white disabled:bg-pink-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {editingId ? 'Updating...' : 'Publishing...'}
                  </span>
                ) : (
                  editingId ? 'Update Product' : 'Publish Product'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="flex-1 rounded-full border-pink-300 text-pink-600 hover:bg-pink-50"
              >
                Reset Form
              </Button>
            </div>
          </div>
        </form>

        {/* Product List */}
        <div className="mt-12 border-t border-pink-100 pt-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif text-gray-800">Existing Products</h2>
            <Button 
              onClick={() => { setIsAdmin(false); localStorage.removeItem('isAdmin'); }} 
              variant="outline" 
              className="text-gray-500 hover:text-red-500 rounded-full border-gray-200"
            >
              Sign out Admin
            </Button>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-pink-500 gap-4">
              <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
              <p className="italic font-medium">Fetching your collection...</p>
            </div>
          ) : Array.isArray(products) && products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {products.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col group">
                <div className="aspect-square relative overflow-hidden bg-pink-50 h-48">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-white shadow-sm transition-colors"
                      title="Edit Product"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-white shadow-sm transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-medium text-gray-800 mb-1">{product.title}</h3>
                  <p className="text-pink-600 font-semibold mb-2">₹{product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">{product.category}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{product.subcategory}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-pink-50 flex justify-between items-center text-sm text-gray-600">
                    <span>Stock: {product.inventory}</span>
                    <span>ID: {product._id.slice(-6)}</span>
                  </div>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-pink-100">
              <p className="text-gray-400 italic">No products found. Start by adding your first masterpiece above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
