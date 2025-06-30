import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const CartDrawer: React.FC = () => {
  const { items, total, itemCount, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const getItemId = (item: any) => {
    return item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-walmart-blue" />
            <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
            {itemCount > 0 && (
              <span className="bg-walmart-blue text-white text-sm px-2 py-1 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started!</p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/products');
                }}
                className="bg-walmart-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-walmart-blue-dark transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={getItemId(item)} className="flex items-center space-x-4 bg-gray-50 rounded-xl p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1">{item.brand}</p>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-600">Size: {item.selectedSize}</p>
                    )}
                    <p className="font-bold text-walmart-blue">${item.price}</p>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={() => removeItem(getItemId(item))}
                      className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(getItemId(item), item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(getItemId(item), item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-walmart-blue">${total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </button>
            
            <button
              onClick={() => {
                closeCart();
                navigate('/products');
              }}
              className="w-full bg-gray-100 text-gray-700 py-2 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};