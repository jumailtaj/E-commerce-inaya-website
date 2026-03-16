import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Package } from 'lucide-react';

// Mock order data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2026-03-10',
    total: 47.98,
    status: 'Delivered',
    items: ['Pink Pearl Hair Clip', 'Modern Claw Clip']
  },
  {
    id: 'ORD-002',
    date: '2026-03-05',
    total: 29.99,
    status: 'Shipped',
    items: ['Classic Pearl Barrette']
  },
  {
    id: 'ORD-003',
    date: '2026-02-28',
    total: 62.97,
    status: 'Delivered',
    items: ['Rhinestone Sparkle Clip', 'Crystal Hair Pin', 'Velvet Bow Clip']
  }
];

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif text-gray-800 mb-8">My Profile</h1>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl text-gray-800 mb-6">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue="Sarah Johnson"
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="sarah.johnson@email.com"
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>
            <Button className="rounded-full bg-pink-600 hover:bg-pink-700 text-white">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl text-gray-800 mb-6">Order History</h2>
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="border border-pink-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-pink-600" />
                      <span className="text-gray-800">{order.id}</span>
                    </div>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-pink-600">${order.total.toFixed(2)}</p>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="text-gray-500">Items: </span>
                  {order.items.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
