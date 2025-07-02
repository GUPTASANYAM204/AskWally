import React from 'react';
import { MapPin, Package, Store, Star, Clock, Phone } from 'lucide-react';
import { getStoreById, getProductAvailabilityAtStore } from '../data/mockProducts';
import type { Product } from '../data/mockProducts';

interface ProductLocationInfoProps {
  product: Product;
  isHighlighted: boolean;
  storeId?: string;
}

export const ProductLocationInfo: React.FC<ProductLocationInfoProps> = ({ 
  product, 
  isHighlighted,
  storeId = 'WM001'
}) => {
  const store = getStoreById(storeId);
  const availability = getProductAvailabilityAtStore(product.id, storeId);
  
  if (!store || !availability) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Product not available at this store</p>
      </div>
    );
  }

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
          <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-walmart-blue">${product.price}</p>
          {product.barcode && (
            <p className="text-xs text-gray-500">#{product.barcode}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Store className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Store Location</p>
            <p className="text-sm text-gray-600">{store.store_name}</p>
            <p className="text-xs text-gray-500">{store.address}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Aisle Location</p>
            <p className="text-sm text-gray-600">
              Aisle {availability.aisle_number} - {availability.section}
            </p>
            <p className="text-xs text-gray-500">Shelf: {availability.shelf_label}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Stock Information</p>
            <p className={`text-sm font-medium ${
              availability.quantity > 10 ? 'text-green-600' : 
              availability.quantity > 0 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {availability.quantity > 0 ? `${availability.quantity} in stock` : 'Out of stock'}
            </p>
            {availability.quantity <= 5 && availability.quantity > 0 && (
              <p className="text-xs text-yellow-600">Limited quantity available</p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Phone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Store Contact</p>
            <p className="text-sm text-gray-600">{store.phone}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800 text-sm">Store Hours Today</p>
            <p className="text-sm text-gray-600">{store.hours.monday}</p>
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
          <li>• Ask team members for assistance if needed</li>
        </ul>
      </div>

      {/* Services Available */}
      {store.services.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h5 className="font-semibold text-gray-800 mb-2 text-sm">Available Services</h5>
          <div className="flex flex-wrap gap-1">
            {store.services.map((service) => (
              <span 
                key={service}
                className="text-xs bg-walmart-blue/10 text-walmart-blue px-2 py-1 rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};