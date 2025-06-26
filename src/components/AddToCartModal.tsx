import React, { useState } from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../data/mockProducts';

interface AddToCartModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({ product, isOpen, onClose }) => {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (product.size && product.size.length > 0 && !selectedSize) {
      return; // Size is required but not selected
    }

    setIsAdding(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addItem(product, selectedSize || undefined);
    setIsAdding(false);
    setIsAdded(true);
    
    // Reset after showing success
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  const handleViewCart = () => {
    onClose();
    openCart();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Add to Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <div className="flex space-x-4 mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                <p className="text-xl font-bold text-walmart-blue">${product.price}</p>
              </div>
            </div>

            {/* Size Selection */}
            {product.size && product.size.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Size *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-walmart-blue bg-walmart-blue text-white'
                          : 'border-gray-300 hover:border-walmart-blue hover:bg-walmart-blue/5'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Store Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Store Information</h4>
              <p className="text-sm text-gray-600 mb-1">{product.storeLocation}</p>
              <p className="text-sm text-gray-600">Aisle {product.aisle}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isAdded ? (
                <div className="flex items-center justify-center space-x-2 bg-green-100 text-green-800 py-3 px-6 rounded-xl">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Added to Cart!</span>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || (product.size && product.size.length > 0 && !selectedSize)}
                  className="w-full bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isAdding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={handleViewCart}
                className="w-full bg-walmart-yellow hover:bg-walmart-yellow-dark text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
              >
                View Cart
              </button>
            </div>

            {product.size && product.size.length > 0 && !selectedSize && (
              <p className="text-sm text-red-500 mt-2 text-center">
                Please select a size to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};