import React from 'react';
import { X } from 'lucide-react';
import { getCategories, getBrands, getPriceRange } from '../data/mockProducts';
import type { ParsedQuery } from '../utils/queryParser';

interface ProductFiltersProps {
  filters: ParsedQuery['filters'];
  onFilterChange: (filters: ParsedQuery['filters']) => void;
  category?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  filters, 
  onFilterChange,
  category 
}) => {
  const categories = getCategories();
  const brands = getBrands();
  const priceRange = getPriceRange();

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters };
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key as keyof ParsedQuery['filters']];
    } else {
      (newFilters as any)[key] = value;
    }
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-500 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder={`Min ($${priceRange.min})`}
                value={filters.price_min || ''}
                onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                min={priceRange.min}
                max={priceRange.max}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder={`Max ($${priceRange.max})`}
                value={filters.price_max || ''}
                onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
                min={priceRange.min}
                max={priceRange.max}
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Range: ${priceRange.min} - ${priceRange.max}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Category
          </label>
          <select
            value={category || ''}
            onChange={(e) => {
              // This would need to be handled at the parent level
              // For now, we'll just show the current category
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Brand
          </label>
          <select
            value={filters.brand || ''}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          >
            <option value="">Any Brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Color
          </label>
          <select
            value={filters.color || ''}
            onChange={(e) => updateFilter('color', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          >
            <option value="">Any Color</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="pink">Pink</option>
            <option value="purple">Purple</option>
            <option value="navy">Navy</option>
            <option value="gray">Gray</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Minimum Rating
          </label>
          <select
            value={filters.rating_min || ''}
            onChange={(e) => updateFilter('rating_min', e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          >
            <option value="">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        {/* Featured Products */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.is_featured || false}
              onChange={(e) => updateFilter('is_featured', e.target.checked || null)}
              className="w-4 h-4 text-walmart-blue border-gray-300 rounded focus:ring-walmart-blue"
            />
            <span className="text-sm font-semibold text-gray-700">Featured Products Only</span>
          </label>
        </div>

        {/* In Stock Only */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.in_stock || false}
              onChange={(e) => updateFilter('in_stock', e.target.checked || null)}
              className="w-4 h-4 text-walmart-blue border-gray-300 rounded focus:ring-walmart-blue"
            />
            <span className="text-sm font-semibold text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Active Filters:</h4>
          <div className="space-y-1 text-xs text-gray-600">
            {filters.price_min && <p>Min Price: ${filters.price_min}</p>}
            {filters.price_max && <p>Max Price: ${filters.price_max}</p>}
            {filters.brand && <p>Brand: {filters.brand}</p>}
            {filters.color && <p>Color: {filters.color}</p>}
            {filters.rating_min && <p>Rating: {filters.rating_min}+ stars</p>}
            {filters.is_featured && <p>Featured products only</p>}
            {filters.in_stock && <p>In stock only</p>}
          </div>
        </div>
      )}
    </div>
  );
};