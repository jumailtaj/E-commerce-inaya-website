import { Link } from 'react-router';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-pink-50 via-white to-white py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-5 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Welcome to Our Shop Inaya
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200">
            Discover our curated collection of stylish hair accessories designed to elevate your everyday look.
          </p>
          <Link
            to="#products"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-sm font-medium text-base hover:bg-pink-700 transform hover:translate-y-[-2px] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Shop Now
          </Link>
        </div>
      </div>
      
      {/* Decorative elements - optimized with will-change */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob will-change-transform"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 will-change-transform"></div>
      <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 will-change-transform"></div>
    </div>
  );
}
