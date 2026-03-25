import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-pink-50 border-t border-pink-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif text-pink-600 mb-4">Inaya</h3>
            <p className="text-gray-600 text-sm">
              Beautiful hair accessories for every style and occasion.
            </p>
          </div>

          <div>
            <h4 className="text-gray-800 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-pink-600 transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping-policy" className="text-gray-600 hover:text-pink-600 transition-colors">Shipping Info</Link></li>
              <li><Link to="/refund-policy" className="text-gray-600 hover:text-pink-600 transition-colors">Refund Policy</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-pink-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-gray-600 hover:text-pink-600 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-800 mb-4">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">youtube</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
