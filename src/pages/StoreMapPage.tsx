import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreMap } from '../components/StoreMap';
import { ProductLocationInfo } from '../components/ProductLocationInfo';
import { stores, getProductsInAisle } from '../data/mockProducts';
import type { Product } from '../data/mockProducts';

export const StoreMapPage: React.FC = () => {
  const location = useLocation();
  const { product, highlightAisle, storeId } = location.state || {};
  const [selectedAisle, setSelectedAisle] = useState<string | null>(highlightAisle || null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(storeId || 'WM001');
  const [aisleProducts, setAisleProducts] = useState<Product[]>([]);

  const handleAisleClick = (aisle: string) => {
    setSelectedAisle(aisle);
    const products = getProductsInAisle(selectedStoreId, aisle);
    setAisleProducts(products);
  };

  const handleStoreChange = (newStoreId: string) => {
    setSelectedStoreId(newStoreId);
    setSelectedAisle(null);
    setAisleProducts([]);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Interactive Store Map
                </h1>
                <p className="text-gray-600">
                  Find your products quickly with our detailed store layout
                </p>
              </div>
              
              {/* Store Selector */}
              <div className="mt-4 md:mt-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Store Location
                </label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => handleStoreChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                >
                  {stores.map((store) => (
                    <option key={store.store_id} value={store.store_id}>
                      {store.store_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            <div className="lg:col-span-3">
              <StoreMap
                highlightedAisle={selectedAisle}
                onAisleClick={handleAisleClick}
                storeId={selectedStoreId}
              />
            </div>
            
            <div className="lg:col-span-1 bg-gray-50 p-6 max-h-[600px] overflow-y-auto">
              {product ? (
                <ProductLocationInfo
                  product={product}
                  isHighlighted={selectedAisle === product.aisle}
                  storeId={selectedStoreId}
                />
              ) : selectedAisle ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Aisle {selectedAisle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {aisleProducts.length} products available
                    </p>
                  </div>
                  
                  {aisleProducts.length > 0 ? (
                    <div className="space-y-3">
                      {aisleProducts.slice(0, 10).map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-600 mb-1">{product.brand}</p>
                              <p className="text-sm font-bold text-walmart-blue">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {aisleProducts.length > 10 && (
                        <p className="text-xs text-gray-500 text-center">
                          And {aisleProducts.length - 10} more products...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No products found in this aisle</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Explore the Store
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Click on any aisle to see available products and get detailed location information.
                  </p>
                  <div className="bg-walmart-blue/5 rounded-lg p-3">
                    <p className="text-xs text-walmart-blue font-medium">
                      💡 Tip: Blue circles show the number of products in each aisle
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};