import { Link } from 'react-router';
import { Product } from '../data/products';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-square overflow-hidden bg-pink-50">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <h3 className="text-gray-800 text-sm font-medium mb-1 truncate group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-pink-600 text-sm font-semibold">₹{product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
