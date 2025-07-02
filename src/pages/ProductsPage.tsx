import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { ProductFilters } from '../components/ProductFilters';
import { SearchSummary } from '../components/SearchSummary';
import { getFilteredProducts, stores } from '../data/mockProducts';
import type { Product } from '../data/mockProducts';
import type { ParsedQuery } from '../utils/queryParser';

export const ProductsPage: React.FC = () => {
  const location = useLocation();
  const { query, parsedQuery, searchPerformed, visualSearch } = location.state || {};
  
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'name' | 'featured'>('rating');
  const [currentFilters, setCurrentFilters] = useState<ParsedQuery['filters']>(parsedQuery?.filters || {});
  const [selectedStore, setSelectedStore] = useState<string>('');

  useEffect(() => {
    if (parsedQuery) {
      const filtered = getFilteredProducts(parsedQuery.category, {
        ...parsedQuery.filters,
        store_id: selectedStore || undefined
      });
      setProducts(filtered);
    } else {
      const filtered = getFilteredProducts(undefined, {
        store_id: selectedStore || undefined
      });
      setProducts(filtered);
    }
  }, [parsedQuery, selectedStore]);

  const handleFilterChange = (newFilters: ParsedQuery['filters']) => {
    setCurrentFilters(newFilters);
    const filtered = getFilteredProducts(parsedQuery?.category, {
      ...newFilters,
      store_id: selectedStore || undefined
    });
    setProducts(filtered);
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'featured':
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchPerformed && (
          <SearchSummary 
            query={query} 
            resultCount={products.length}
            parsedQuery={parsedQuery}
          />
        )}

        {visualSearch && (
          <div className="mb-6 bg-gradient-to-r from-walmart-blue/5 to-walmart-yellow/5 rounded-2xl p-4 border border-walmart-blue/20">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📷</span>
              <div>
                <h3 className="font-semibold text-walmart-blue">Visual Search Results</h3>
                <p className="text-sm text-gray-600">Products found using AI image recognition</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters
              filters={currentFilters}
              onFilterChange={handleFilterChange}
              category={parsedQuery?.category}
            />
          </aside>
          
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {products.length} Products Found
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Store Filter */}
                <select
                  value={selectedStore}
                  onChange={(e) => handleStoreChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                >
                  <option value="">All Stores</option>
                  {stores.map((store) => (
                    <option key={store.store_id} value={store.store_id}>
                      {store.store_name.replace('Walmart Supercenter - ', '')}
                    </option>
                  ))}
                </select>

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            {(selectedStore || Object.keys(currentFilters).length > 0) && (
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span>Filtered by:</span>
                  {selectedStore && (
                    <span className="bg-walmart-blue/10 text-walmart-blue px-2 py-1 rounded-full">
                      {stores.find(s => s.store_id === selectedStore)?.store_name.replace('Walmart Supercenter - ', '')}
                    </span>
                  )}
                  {currentFilters.price_min && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      Min: ${currentFilters.price_min}
                    </span>
                  )}
                  {currentFilters.price_max && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      Max: ${currentFilters.price_max}
                    </span>
                  )}
                  {currentFilters.brand && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      {currentFilters.brand}
                    </span>
                  )}
                  {currentFilters.is_featured && (
                    <span className="bg-walmart-yellow/20 text-walmart-yellow-dark px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <ProductGrid products={sortedProducts} />
          </main>
        </div>
      </div>
    </div>
  );
};