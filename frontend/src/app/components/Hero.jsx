import { Link } from 'react-router';
import { Sparkles, Truck, Heart } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-pink-50 via-white to-white py-16 sm:py-20 overflow-hidden border-b border-pink-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          
          {/* Tagline/Brand intro */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-600 rounded-sm text-xs font-bold uppercase tracking-wider mb-5 animate-in fade-in duration-700">
            <Sparkles className="w-3.5 h-3.5" />
            Designed for Everyday Elegance
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Welcome to Inaya
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200">
            Discover our curated collection of premium hair accessories. From hand-polished acetate clutches to comfort-wrapped hair bands and elegant hair pins, each piece is designed to secure your hair beautifully while ensuring zero snagging or damage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
            <Link
              to="#products"
              className="w-full sm:w-auto inline-block bg-pink-600 text-white px-8 py-3 rounded-sm font-medium text-base hover:bg-pink-700 transform hover:translate-y-[-2px] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Now
            </Link>
            <Link
              to="/hair-care-guide"
              className="w-full sm:w-auto inline-block bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-sm font-medium text-base hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transform hover:translate-y-[-2px] transition-all duration-300 shadow-sm active:scale-95"
            >
              Read Styling Guide
            </Link>
          </div>

          {/* Social Proof */}
          <p className="text-xs text-gray-400 mb-10 tracking-wide font-medium uppercase animate-in fade-in duration-1000 delay-400">
            Loved by <span className="text-pink-600 font-bold">10,000+</span> Customers • As seen on Instagram
          </p>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8 border-t border-pink-100/50 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center justify-center gap-3 p-4 bg-pink-50/20 rounded-sm border border-pink-100/30">
              <Sparkles className="w-5 h-5 text-pink-600 shrink-0" />
              <div className="text-left">
                <h4 className="font-bold text-gray-800 text-sm">Premium Quality</h4>
                <p className="text-xs text-gray-500">Hand-polished acetate & fine alloys</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-pink-50/20 rounded-sm border border-pink-100/30">
              <Heart className="w-5 h-5 text-pink-600 shrink-0" />
              <div className="text-left">
                <h4 className="font-bold text-gray-800 text-sm">Hair Health First</h4>
                <p className="text-xs text-gray-500">Snag-free, round-edged designs</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-pink-50/20 rounded-sm border border-pink-100/30">
              <Truck className="w-5 h-5 text-pink-600 shrink-0" />
              <div className="text-left">
                <h4 className="font-bold text-gray-800 text-sm">Free Shipping</h4>
                <p className="text-xs text-gray-500">Free delivery nationwide on all orders</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative elements - optimized with will-change */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob will-change-transform"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 will-change-transform"></div>
      <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 will-change-transform"></div>
    </div>
  );
}

