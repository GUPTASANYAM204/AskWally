import React from 'react';
import { X } from 'lucide-react';
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
                placeholder="Min"
                value={filters.price_min || ''}
                onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={filters.price_max || ''}
                onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
              />
            </div>
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
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="food">Food & Grocery</option>
            <option value="home">Home & Garden</option>
            <option value="toys">Toys & Games</option>
            <option value="health">Health & Beauty</option>
            <option value="sports">Sports & Outdoors</option>
          </select>
        </div>

        {/* Color */}
        {(category === 'clothing' || !category) && (
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
            </select>
          </div>
        )}

        {/* Gender/Department */}
        {category === 'clothing' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Department
            </label>
            <select
              value={filters.gender || ''}
              onChange={(e) => updateFilter('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue"
            >
              <option value="">All Departments</option>
              <option value="men">Men's</option>
              <option value="women">Women's</option>
              <option value="kids">Kids'</option>
            </select>
          </div>
        )}

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
            <option value="samsung">Samsung</option>
            <option value="apple">Apple</option>
            <option value="sony">Sony</option>
            <option value="hp">HP</option>
            <option value="nintendo">Nintendo</option>
            <option value="hanes">Hanes</option>
            <option value="lego">LEGO</option>
            <option value="coleman">Coleman</option>
            <option value="oral-b">Oral-B</option>
            <option value="olay">Olay</option>
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
      </div>
    </div>
  );
};