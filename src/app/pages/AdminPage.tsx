import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    image: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    toast.success('Product added successfully!');
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      image: null
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Add new products to your store</p>
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

            {/* Image Upload */}
            <div>
              <Label htmlFor="image">Product Image</Label>
              <div className="mt-1">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer bg-pink-50 hover:bg-pink-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-pink-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
                  </div>
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
                className="flex-1 rounded-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                Publish Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({
                  title: '',
                  description: '',
                  price: '',
                  stock: '',
                  image: null
                })}
                className="flex-1 rounded-full border-pink-300 text-pink-600 hover:bg-pink-50"
              >
                Reset Form
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
