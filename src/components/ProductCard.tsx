import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Package, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { AddToCartModal } from './AddToCartModal';
import type { Product } from '../data/mockProducts';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/store-map', { 
      state: { 
        product,
        highlightAisle: product.aisle 
      } 
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.size && product.size.length > 0) {
      // Show modal for size selection
      setShowAddToCartModal(true);
    } else {
      // Add directly to cart
      addItem(product);
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 cursor-pointer"
        onClick={handleViewDetails}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
              Sale
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-walmart-blue">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          {/* Store Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{product.storeLocation}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>Aisle {product.aisle}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
            
            <button
              onClick={handleViewOnMap}
              className="w-full bg-walmart-yellow hover:bg-walmart-yellow-dark text-gray-800 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>View on Store Map</span>
            </button>
          </div>
        </div>
      </div>

      <AddToCartModal
        product={product}
        isOpen={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
      />
    </>
  );
};