import { Link } from 'react-router';
import { memo } from 'react';

export const ProductCard = memo(function ProductCard({ product, priority = false }) {
  let optimizedImageSrc = product.image;
  if (optimizedImageSrc && optimizedImageSrc.includes('cloudinary.com')) {
    if (!optimizedImageSrc.includes('f_auto') && !optimizedImageSrc.includes('q_auto')) {
      optimizedImageSrc = optimizedImageSrc.replace('/upload/', '/upload/f_auto,q_auto,w_500,c_limit/');
    }
  }

  return (
    <Link to={`/product/${product.id || product._id}`} className="group">
      <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-square overflow-hidden bg-pink-50">
          <img
            src={optimizedImageSrc}
            alt={product.title || product.name}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
          />
        </div>
        <div className="p-2">
          <h3 className="text-gray-800 text-sm font-medium mb-1 truncate group-hover:text-pink-600 transition-colors">
            {product.title || product.name}
          </h3>
          {product.type && (
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              {product.type}
            </p>
          )}
          <p className="text-pink-600 text-sm font-semibold">₹{product.price?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
    </Link>
  );
});
