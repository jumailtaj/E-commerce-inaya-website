import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Package, MapPin, UserCircle, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-pink-50 rounded-full transition-colors relative group"
        aria-label="Profile"
      >
        <User className={`w-5 h-5 ${isAuthenticated ? 'text-pink-600' : 'text-gray-700'} group-hover:text-pink-600`} />
        {isAuthenticated && (
          <span className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-pink-50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-3 border-b border-pink-50">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircle className="w-4 h-4 text-pink-500" />
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="w-4 h-4 text-pink-500" />
                  Orders
                </Link>
              </div>
              <div className="border-t border-pink-50 py-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4 text-pink-500" />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="w-4 h-4 text-pink-500" />
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
