import React from 'react';
import { MapPin, Package, Store, Star } from 'lucide-react';
import type { Product } from '../data/mockProducts';

interface ProductLocationInfoProps {
  product: Product;
  isHighlighted: boolean;
}

export const ProductLocationInfo: React.FC<ProductLocationInfoProps> = ({ 
  product, 
  isHighlighted 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
          isHighlighted 
            ? 'bg-gradient-to-br from-walmart-blue to-walmart-blue-dark' 
            : 'bg-gray-200'
        }`}>
          <MapPin className={`w-8 h-8 ${isHighlighted ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Product Location</h3>
        <p className="text-sm text-gray-600">
          {isHighlighted ? 'Currently highlighted on map' : 'Click the aisle on the map to highlight'}
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
        <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
          {product.name}
        </h4>
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>
        <p className="text-lg font-bold text-walmart-blue">${product.price}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Store className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Store Location</p>
            <p className="text-sm text-gray-600">{product.storeLocation}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Aisle Location</p>
            <p className="text-sm text-gray-600">Aisle {product.aisle}</p>
          </div>
        </div>
      </div>

      <div className="bg-walmart-blue/5 rounded-xl p-4 border border-walmart-blue/20">
        <h5 className="font-semibold text-walmart-blue mb-2 text-sm">Navigation Tips</h5>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Enter through the main entrance</li>
          <li>• Head past the checkout area</li>
          <li>• Look for aisle markers on overhead signs</li>
          <li>• Products are organized by category</li>
        </ul>
      </div>
    </div>
  );
};