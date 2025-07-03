import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, Home, ShoppingBag, User, LogOut, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, toggleCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-walmart-blue to-walmart-blue-dark bg-clip-text text-transparent">
              AskWally
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-walmart-blue text-white shadow-lg' 
                  : 'text-gray-600 hover:text-walmart-blue hover:bg-walmart-blue/10'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link
              to="/products"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/products') 
                  ? 'bg-walmart-blue text-white shadow-lg' 
                  : 'text-gray-600 hover:text-walmart-blue hover:bg-walmart-blue/10'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-medium">Products</span>
            </Link>
            
            <Link
              to="/store-map"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/store-map') 
                  ? 'bg-walmart-blue text-white shadow-lg' 
                  : 'text-gray-600 hover:text-walmart-blue hover:bg-walmart-blue/10'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Store Map</span>
            </Link>

            <Link
                  to="/wishlist"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-walmart-blue hover:bg-walmart-blue/10 transition-all duration-200"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">Wishlist</span>
                </Link>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-walmart-blue hover:bg-walmart-blue/10 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-walmart-blue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 text-gray-600 hover:bg-walmart-blue/10 px-2 py-1 rounded-lg transition-all duration-200 focus:outline-none"
                  title="Go to Profile"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover border-2 border-walmart-blue shadow-sm"
                    />
                  ) : (
                    <User className="w-6 h-6 text-walmart-blue" />
                  )}
                  <span className="font-medium">Hi, {user?.firstName}</span>
                </button>
                
                {/* <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button> */}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-walmart-blue font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};