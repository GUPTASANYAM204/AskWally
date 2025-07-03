import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Package, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { mockProducts } from '../data/mockProducts';
import type { Product } from '../data/mockProducts';
import { useWishlist } from '../contexts/WishlistContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = mockProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.image);
        if (foundProduct.size && foundProduct.size.length > 0) {
          setSelectedSize(foundProduct.size[0]);
        }
      }
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.size && product.size.length > 0 && !selectedSize) {
      return;
    }

    setIsAddingToCart(true);
    
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize || undefined);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAddingToCart(false);
    openCart();
  };

  const handleViewOnMap = () => {
    navigate('/store-map', { 
      state: { 
        product,
        highlightAisle: product?.aisle 
      } 
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out this product on AskWally: ${product?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (!product) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-walmart-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-walmart-blue-dark transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const inWishlist = product ? isInWishlist(product.id, selectedSize) : false;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-walmart-blue transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Additional product images would go here */}
            <div className="grid grid-cols-4 gap-3">
              {[product.image, product.image, product.image, product.image].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === img ? 'border-walmart-blue' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (!product) return;
                      if (inWishlist) {
                        removeFromWishlist(product.id, selectedSize || undefined);
                      } else {
                        addToWishlist({
                          id: product.id,
                          name: product.name,
                          image: product.image,
                          brand: product.brand,
                          price: product.price,
                          selectedSize: selectedSize || undefined
                        });
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors duration-200 bg-gray-100 hover:bg-gray-200`}
                  >
                    <Heart
                      className="w-5 h-5"
                      color={inWishlist ? "#3B82F6" : "#9CA3AF"}
                      fill={inWishlist ? "#3B82F6" : "none"}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-800">{product.rating}</span>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-walmart-blue">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Size Selection */}
            {product.size && product.size.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Size</h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border-2 rounded-lg font-semibold transition-all duration-200 ${
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

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock || (product.size && product.size.length > 0 && !selectedSize)}
                className="w-full bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleViewOnMap}
                className="w-full bg-walmart-yellow hover:bg-walmart-yellow-dark text-gray-800 py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <MapPin className="w-5 h-5" />
                <span>Find in Store</span>
              </button>
            </div>

            {/* Store Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">{product.storeLocation}</p>
                    <p className="text-sm text-gray-600">Available in store</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Aisle {product.aisle}</p>
                    <p className="text-sm text-gray-600">Easy to find location</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <Truck className="w-8 h-8 text-walmart-blue mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders $35+</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <RotateCcw className="w-8 h-8 text-walmart-blue mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Easy Returns</p>
                <p className="text-xs text-gray-600">90-day policy</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <Shield className="w-8 h-8 text-walmart-blue mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Secure Payment</p>
                <p className="text-xs text-gray-600">Protected checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• High-quality materials</li>
                  <li>• Comfortable fit</li>
                  <li>• Durable construction</li>
                  <li>• Easy care instructions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Brand:</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium capitalize">{product.category}</span>
                  </div>
                  {product.color && (
                    <div className="flex justify-between">
                      <span>Color:</span>
                      <span className="font-medium capitalize">{product.color}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};