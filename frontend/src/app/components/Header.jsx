import { Search, ShoppingCart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import { Input } from './ui/input';
import { useState, useEffect } from 'react';
import { ProfileDropdown } from './ProfileDropdown';
import { useDebounce } from '../hooks/useDebounce';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const cartCount = getCartCount();

  useEffect(() => {
    if (debouncedSearch) {
      navigate(`/?search=${encodeURIComponent(debouncedSearch)}`);
    } else if (searchQuery === '' && location.search.includes('search=')) {
      navigate('/');
    }
  }, [debouncedSearch, navigate, location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl font-serif text-pink-600">Inaya</h1>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search hair clips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-pink-200 focus:border-pink-300 focus:ring-pink-200"
              />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <ProfileDropdown />
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-pink-50 rounded-full transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search hair clips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-pink-200 focus:border-pink-300 focus:ring-pink-200"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
