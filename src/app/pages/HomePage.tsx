import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-gray-800 mb-3">
            Beautiful Hair Accessories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of elegant hair clips designed to elevate your everyday style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
