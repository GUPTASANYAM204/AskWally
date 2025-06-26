import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreMap } from '../components/StoreMap';
import { ProductLocationInfo } from '../components/ProductLocationInfo';
import type { Product } from '../data/mockProducts';

export const StoreMapPage: React.FC = () => {
  const location = useLocation();
  const { product, highlightAisle } = location.state || {};
  const [selectedAisle, setSelectedAisle] = useState<string | null>(highlightAisle || null);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Store Map - Walmart Supercenter
            </h1>
            <p className="text-gray-600">
              Find your products quickly with our interactive store layout
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            <div className="lg:col-span-3">
              <StoreMap
                highlightedAisle={selectedAisle}
                onAisleClick={setSelectedAisle}
              />
            </div>
            
            <div className="lg:col-span-1 bg-gray-50 p-6">
              {product && (
                <ProductLocationInfo
                  product={product}
                  isHighlighted={selectedAisle === product.aisle}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};