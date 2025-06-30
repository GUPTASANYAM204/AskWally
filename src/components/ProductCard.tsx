import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Package, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { AddToCartModal } from './AddToCartModal';
import type { Product } from '../data/mockProducts';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const { wishlists, selectedWishlistId, addToWishlist, removeFromWishlist, isInWishlist, selectWishlist, createWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id, product.selectedSize);
  const [wishlistActive, setWishlistActive] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [showWishlistPicker, setShowWishlistPicker] = useState(false);
  const [wishlistFeedback, setWishlistFeedback] = useState<string | null>(null);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id, product.selectedSize);
      setWishlistFeedback('Removed from wishlist!');
      setTimeout(() => setWishlistFeedback(null), 1500);
    } else {
      setWishlistActive(true);
      setShowWishlistPicker(true);
    }
  };

  const handleCancelWishlistPicker = () => {
    setShowWishlistPicker(false);
    setWishlistActive(false);
    setNewWishlistName('');
  };

  const handleAddToSelectedWishlist = (wishlistId: string) => {
    addToWishlist({
      id: product.id,
      name: product.name,
      image: product.image,
      brand: product.brand,
      price: product.price,
      selectedSize: product.selectedSize,
    }, wishlistId);
    setShowWishlistPicker(false);
    setWishlistActive(false);
    setWishlistFeedback('Added to wishlist!');
    setTimeout(() => setWishlistFeedback(null), 1500);
  };

  const handleCreateAndAddToWishlist = () => {
    if (newWishlistName.trim()) {
      const name = newWishlistName.trim();
      createWishlist(name);
      setTimeout(() => {
        const created = wishlists.find(w => w.name === name);
        const newId = created ? created.id : wishlists[0]?.id;
        handleAddToSelectedWishlist(newId);
      }, 100);
      setNewWishlistName('');
    }
  };

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
      setShowAddToCartModal(true);
    } else {
      addItem(product);
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 cursor-pointer relative"
        onClick={handleViewDetails}
      >
        {wishlistFeedback && (
          <div className="absolute left-1/2 -translate-x-1/2 top-2 z-30 bg-walmart-blue text-white px-4 py-1 rounded shadow-lg text-sm animate-fade-in-out">
            {wishlistFeedback}
          </div>
        )}
        <button
          className={`absolute top-3 right-3 z-10 rounded-full p-1 bg-white/80 hover:bg-walmart-blue/10 border border-gray-200 shadow transition-colors duration-200`}
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-6 h-6 ${inWishlist || wishlistActive ? 'fill-walmart-blue text-walmart-blue' : 'text-gray-400'}`} />
        </button>
        {showWishlistPicker && (
          <div className="absolute top-12 right-3 z-20 bg-white border border-gray-200 rounded shadow-lg p-2 w-64 min-w-[16rem]">
            <div className="font-semibold text-gray-700 mb-2">Add to wishlist:</div>
            <ul>
              {wishlists.map(wl => (
                <li key={wl.id}>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-walmart-blue/10 ${wl.id === selectedWishlistId ? 'font-bold text-walmart-blue' : ''}`}
                    onClick={e => { e.stopPropagation(); handleAddToSelectedWishlist(wl.id); }}
                  >
                    {wl.name}
                  </button>
                </li>
              ))}
            </ul>
            <hr className="my-2" />
            <div className="flex gap-2 items-center mt-2">
              <input
                type="text"
                value={newWishlistName}
                onChange={e => setNewWishlistName(e.target.value)}
                placeholder="Create new wishlist"
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
              <button
                className="bg-walmart-blue text-white px-3 py-1 rounded text-sm font-semibold disabled:opacity-50"
                disabled={!newWishlistName.trim()}
                onClick={e => { e.stopPropagation(); handleCreateAndAddToWishlist(); }}
              >Create</button>
            </div>
            <button className="mt-2 text-xs text-gray-500 hover:underline w-full text-center" onClick={e => { e.stopPropagation(); handleCancelWishlistPicker(); }}>Cancel</button>
          </div>
        )}

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

        <div className="p-6">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">{product.brand}</p>
          </div>

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

          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-walmart-blue">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

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
