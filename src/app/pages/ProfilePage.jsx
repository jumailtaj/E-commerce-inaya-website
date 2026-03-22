import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

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
                defaultValue={user.name}
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                className="mt-1 rounded-lg border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>
            <div className="flex gap-4">
              <Button className="rounded-full bg-pink-600 hover:bg-pink-700 text-white">
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={logout}
                className="rounded-full border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <div 
            onClick={() => navigate('/orders')}
            className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow group border border-transparent hover:border-pink-100"
          >
            <div className="bg-pink-100 p-4 rounded-full mb-4 group-hover:bg-pink-200 transition-colors">
              <Package className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">My Orders</h3>
            <p className="text-gray-500 text-center">Track your packages and view purchase history</p>
          </div>

          <div 
            onClick={() => navigate('/')}
            className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow group border border-transparent hover:border-pink-100"
          >
            <div className="bg-pink-50 p-4 rounded-full mb-4 group-hover:bg-pink-100 transition-colors">
              <ShoppingBag className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Continue Shopping</h3>
            <p className="text-gray-500 text-center">Discover more beautiful hair clips</p>
          </div>
        </div>
      </div>
    </div>
  );
}
