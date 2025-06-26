import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { ProductFilters } from '../components/ProductFilters';
import { SearchSummary } from '../components/SearchSummary';
import { getFilteredProducts } from '../data/mockProducts';
import type { Product } from '../data/mockProducts';
import type { ParsedQuery } from '../utils/queryParser';

export const ProductsPage: React.FC = () => {
  const location = useLocation();
  const { query, parsedQuery, searchPerformed } = location.state || {};
  
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'name'>('rating');
  const [currentFilters, setCurrentFilters] = useState<ParsedQuery['filters']>(parsedQuery?.filters || {});

  useEffect(() => {
    if (parsedQuery) {
      const filtered = getFilteredProducts(parsedQuery.category, parsedQuery.filters);
      setProducts(filtered);
    } else {
      setProducts(getFilteredProducts());
    }
  }, [parsedQuery]);

  const handleFilterChange = (newFilters: ParsedQuery['filters']) => {
    setCurrentFilters(newFilters);
    const filtered = getFilteredProducts(parsedQuery?.category, newFilters);
    setProducts(filtered);
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
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters
              filters={currentFilters}
              onFilterChange={handleFilterChange}
              category={parsedQuery?.category}
            />
          </aside>
          
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {products.length} Products Found
              </h2>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
            
            <ProductGrid products={sortedProducts} />
          </main>
        </div>
      </div>
    </div>
  );
};