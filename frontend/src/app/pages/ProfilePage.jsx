import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Package, MapPin, User, Phone, Mail, Plus, Trash2, CheckCircle2, ChevronRight, ShoppingBag, Edit2, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user, logout, updateProfile, addAddress, updateAddress, deleteAddress } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // profile, addresses
  
  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Address state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressData, setAddressData] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const res = await updateProfile(profileData);
    if (res.success) {
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } else {
      toast.error(res.message);
    }
  };

  const resetAddressForm = () => {
    setAddressData({
      fullName: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (editingAddressId) {
      res = await updateAddress(editingAddressId, addressData);
    } else {
      res = await addAddress(addressData);
    }

    if (res.success) {
      toast.success(editingAddressId ? 'Address updated' : 'Address added');
      resetAddressForm();
    } else {
      toast.error(res.message);
    }
  };

  const handleEditAddress = (addr) => {
    setAddressData({
      fullName: addr.fullName,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault
    });
    setEditingAddressId(addr._id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const res = await deleteAddress(id);
      if (res.success) {
        toast.success('Address deleted');
      } else {
        toast.error(res.message);
      }
    }
  };

  const handleSetDefaultAddress = async (id) => {
    const res = await updateAddress(id, { isDefault: true });
    if (res.success) {
      toast.success('Default address updated');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <div className="md:w-64 shrink-0">
            <div className="bg-white rounded-sm shadow-sm border border-pink-50 overflow-hidden">
              <div className="p-6 bg-pink-50/50 border-b border-pink-50">
                <div className="w-16 h-16 bg-pink-100 rounded-sm flex items-center justify-center mb-3">
                  <User className="w-8 h-8 text-pink-600" />
                </div>
                <h2 className="font-bold text-gray-900 truncate">{user.name}</h2>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                    activeTab === 'profile' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  <UserCircle className="w-4 h-4" />
                  Basic Information
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                    activeTab === 'addresses' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Saved Addresses
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-gray-600 hover:bg-pink-50 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </button>
                <div className="my-2 border-t border-pink-50" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-sm shadow-sm border border-pink-50 p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Basic Information</h2>
                  {!isEditingProfile && (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingProfile(true)}
                      className="rounded-sm border-pink-100 hover:border-pink-200"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        disabled={!isEditingProfile}
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="pl-12 h-12 bg-gray-50/50 border-pink-50 focus:border-pink-200 transition-all shadow-none rounded-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        disabled={!isEditingProfile}
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="pl-12 h-12 bg-gray-50/50 border-pink-50 focus:border-pink-200 transition-all shadow-none rounded-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        disabled={!isEditingProfile}
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="Add phone number"
                        className="pl-12 h-12 bg-gray-50/50 border-pink-50 focus:border-pink-200 transition-all shadow-none rounded-sm"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2 pt-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Account Type</Label>
                    <div className="inline-flex items-center px-3 py-1 bg-pink-50 text-pink-600 rounded-sm text-xs font-bold uppercase tracking-wider border border-pink-100">
                      {user.role}
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="md:col-span-2 flex items-center gap-4 pt-6 border-t border-pink-50 mt-4">
                      <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white rounded-sm px-8 h-11">
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileData({ name: user.name, email: user.email, phone: user.phone });
                        }}
                        className="rounded-sm h-11"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-sm shadow-sm border border-pink-50 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Saved Addresses</h2>
                    {!showAddressForm && (
                      <Button 
                        onClick={() => setShowAddressForm(true)}
                        className="bg-pink-600 hover:bg-pink-700 text-white rounded-sm px-6 h-11"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                      </Button>
                    )}
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddressSubmit} className="bg-pink-50/50 rounded-sm p-6 mb-8 border border-pink-100 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">{editingAddressId ? 'Edit Address' : 'New Address'}</h3>
                        <button type="button" onClick={resetAddressForm} className="p-2 hover:bg-pink-100 rounded-sm transition-colors">
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            required
                            value={addressData.fullName}
                            onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                            className="bg-white border-pink-100 rounded-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="addressLine">Address Line</Label>
                          <Input
                            id="addressLine"
                            required
                            value={addressData.addressLine}
                            onChange={(e) => setAddressData({ ...addressData, addressLine: e.target.value })}
                            className="bg-white border-pink-100 rounded-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            required
                            value={addressData.city}
                            onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                            className="bg-white border-pink-100 rounded-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            required
                            value={addressData.state}
                            onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                            className="bg-white border-pink-100 rounded-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            required
                            value={addressData.pincode}
                            onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                            className="bg-white border-pink-100 rounded-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                          <input
                            type="checkbox"
                            id="isDefault"
                            checked={addressData.isDefault}
                            onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })}
                            className="w-4 h-4 text-pink-600 rounded bg-white border-pink-100 focus:ring-pink-500"
                          />
                          <Label htmlFor="isDefault" className="text-sm cursor-pointer">Set as default address</Label>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-8">
                        <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white rounded-sm px-8 h-11 flex-1 sm:flex-none">
                          {editingAddressId ? 'Update Address' : 'Save Address'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={resetAddressForm} className="rounded-sm h-11 px-8">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses?.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-pink-100 rounded-sm bg-pink-50/20">
                        <MapPin className="w-12 h-12 text-pink-200 mx-auto mb-4" />
                        <p>No addresses saved yet</p>
                      </div>
                    ) : (
                      user.addresses?.map((addr) => (
                        <div 
                          key={addr._id} 
                          className={`relative p-5 rounded-sm border transition-all ${
                            addr.isDefault ? 'border-pink-500 bg-pink-50/30' : 'border-gray-100 bg-white hover:border-pink-200'
                          }`}
                        >
                          {addr.isDefault && (
                            <span className="absolute top-4 right-4 flex items-center gap-1 bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Default
                            </span>
                          )}
                          <p className="font-bold text-gray-900 mb-1">{addr.fullName}</p>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {addr.addressLine}, {addr.city}<br />
                            {addr.state} - {addr.pincode}
                          </p>
                          
                          <div className="flex items-center gap-3 pt-3 border-t border-pink-50">
                            <button 
                              onClick={() => handleEditAddress(addr)}
                              className="text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors uppercase tracking-widest"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteAddress(addr._id)}
                              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest"
                            >
                              Delete
                            </button>
                            {!addr.isDefault && (
                              <button 
                                onClick={() => handleSetDefaultAddress(addr._id)}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest ml-auto"
                              >
                                Set Default
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-sm shadow-sm border border-transparent hover:border-pink-50 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group lg:hidden" onClick={() => navigate('/orders')}>
                  <div className="bg-pink-100 p-4 rounded-sm mb-4 group-hover:bg-pink-200 transition-colors">
                    <Package className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">My Orders</h3>
                  <p className="text-gray-500 text-center">Track your packages and view purchase history</p>
                  <ChevronRight className="w-5 h-5 text-pink-300 mt-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing imports that need to be manually added to top if not present:
import { LogOut, UserCircle } from 'lucide-react';
