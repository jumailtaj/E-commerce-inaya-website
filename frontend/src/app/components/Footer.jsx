import { Link } from 'react-router';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pink-50 border-t border-pink-100 mt-16 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-serif text-pink-600 mb-4 font-bold">Inaya</h3>
            <p className="text-sm leading-relaxed mb-4">
              Premium hair accessories crafted for everyday elegance and hair safety.
            </p>
            <p className="text-xs text-gray-400">
              &copy; {currentYear} Inaya.<br />All rights reserved.
            </p>
          </div>

          {/* Column 2: Shop & Brand */}
          <div>
            <h4 className="text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider">Shop & Brand</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-pink-600 transition-colors">All Products</Link></li>
              <li><Link to="/about" className="hover:text-pink-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-pink-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            <h4 className="text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hair-care-guide" className="hover:text-pink-600 transition-colors font-medium">Hair Care Guide</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping-policy" className="hover:text-pink-600 transition-colors">Shipping Info</Link></li>
              <li><Link to="/refund-policy" className="hover:text-pink-600 transition-colors">Refund Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-pink-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-pink-600 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Column 5: Follow Us */}
          <div>
            <h4 className="text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.instagram.com/inayaadotcom/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">Instagram</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=61576641383862" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">Facebook</a></li>
              <li><a href="https://www.youtube.com/@inayaafancystore" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">YouTube</a></li>
              <li><a href="https://wa.me/923172171142" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors font-medium text-pink-600">WhatsApp</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

