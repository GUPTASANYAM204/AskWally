import React from 'react';
import { stores, getProductsInAisle, getStoreById } from '../data/mockProducts';
import type { Store } from '../data/mockProducts';

interface StoreMapProps {
  highlightedAisle?: string | null;
  onAisleClick: (aisle: string) => void;
  storeId?: string;
}

export const StoreMap: React.FC<StoreMapProps> = ({ 
  highlightedAisle, 
  onAisleClick, 
  storeId = 'WM001' // Default to downtown store
}) => {
  const store = getStoreById(storeId);
  
  if (!store) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Store not found</p>
      </div>
    );
  }

  const getDepartmentColor = (departmentName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Electronics': 'fill-blue-200 stroke-blue-400 hover:fill-blue-300',
      'Groceries': 'fill-green-200 stroke-green-400 hover:fill-green-300',
      'Apparel': 'fill-purple-200 stroke-purple-400 hover:fill-purple-300',
      'Home Essentials': 'fill-orange-200 stroke-orange-400 hover:fill-orange-300',
      'Health & Beauty': 'fill-red-200 stroke-red-400 hover:fill-red-300',
      'Toys': 'fill-pink-200 stroke-pink-400 hover:fill-pink-300',
      'Stationery': 'fill-yellow-200 stroke-yellow-400 hover:fill-yellow-300',
      'Furniture': 'fill-indigo-200 stroke-indigo-400 hover:fill-indigo-300',
      'Automotive': 'fill-gray-200 stroke-gray-400 hover:fill-gray-300',
      'Pet Supplies': 'fill-teal-200 stroke-teal-400 hover:fill-teal-300',
    };
    return colorMap[departmentName] || 'fill-gray-200 stroke-gray-400 hover:fill-gray-300';
  };

  const getAisleColor = (aisle: string, departmentName: string): string => {
    if (highlightedAisle === aisle) {
      return 'fill-walmart-blue stroke-walmart-blue-dark stroke-2';
    }
    return getDepartmentColor(departmentName);
  };

  const handleAisleClick = (aisle: string) => {
    onAisleClick(aisle);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{store.store_name}</h3>
        <p className="text-sm text-gray-600 mb-2">{store.address}</p>
        <p className="text-sm text-gray-600 mb-4">📞 {store.phone}</p>
        
        {/* Department Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {store.layout.departments.map((dept) => (
            <div
              key={dept.name}
              className={`px-3 py-1 rounded-full border-2 text-xs font-medium ${getDepartmentColor(dept.name).replace('fill-', 'bg-').replace('stroke-', 'border-').replace('hover:fill-', 'hover:bg-')}`}
            >
              {dept.name}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 overflow-auto" style={{ minHeight: '500px' }}>
        <svg viewBox="0 0 720 550" className="w-full h-full">
          {/* Store Entrance */}
          <rect x="310" y="20" width="100" height="20" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
          <text x="360" y="35" textAnchor="middle" className="text-sm font-bold fill-gray-700">
            MAIN ENTRANCE
          </text>

          {/* Special Areas */}
          {store.layout.special_areas.map((area) => (
            <g key={area.name}>
              <rect 
                x={area.coordinates.x - 40} 
                y={area.coordinates.y - 15} 
                width="80" 
                height="30" 
                fill="#fef3c7" 
                stroke="#f59e0b" 
                strokeWidth="2" 
              />
              <text 
                x={area.coordinates.x} 
                y={area.coordinates.y + 5} 
                textAnchor="middle" 
                className="text-xs font-medium fill-yellow-800"
              >
                {area.name}
              </text>
            </g>
          ))}

          {/* Department Sections */}
          {store.layout.departments.map((department) => (
            <g key={department.name}>
              {department.sections.map((section) => {
                const products = getProductsInAisle(storeId, section.aisle);
                const productCount = products.length;
                
                return (
                  <g key={section.aisle}>
                    <rect
                      x={section.coordinates.x}
                      y={section.coordinates.y}
                      width="100"
                      height="25"
                      className={`${getAisleColor(section.aisle, department.name)} cursor-pointer transition-all duration-200`}
                      onClick={() => handleAisleClick(section.aisle)}
                    />
                    <text
                      x={section.coordinates.x + 50}
                      y={section.coordinates.y + 12}
                      textAnchor="middle"
                      className="text-xs font-bold fill-gray-700 pointer-events-none"
                    >
                      {section.aisle}
                    </text>
                    <text
                      x={section.coordinates.x + 50}
                      y={section.coordinates.y + 22}
                      textAnchor="middle"
                      className="text-xs fill-gray-600 pointer-events-none"
                      style={{ fontSize: '9px' }}
                    >
                      {section.section.length > 12 ? section.section.substring(0, 12) + '...' : section.section}
                    </text>
                    {/* Product count indicator */}
                    {productCount > 0 && (
                      <circle
                        cx={section.coordinates.x + 90}
                        cy={section.coordinates.y + 5}
                        r="8"
                        fill="#0071CE"
                        className="pointer-events-none"
                      />
                    )}
                    {productCount > 0 && (
                      <text
                        x={section.coordinates.x + 90}
                        y={section.coordinates.y + 9}
                        textAnchor="middle"
                        className="text-xs font-bold fill-white pointer-events-none"
                        style={{ fontSize: '8px' }}
                      >
                        {productCount}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          ))}

          {/* Department Labels */}
          {store.layout.departments.map((department) => {
            // Calculate center position for department label
            const sections = department.sections;
            if (sections.length === 0) return null;
            
            const avgX = sections.reduce((sum, s) => sum + s.coordinates.x, 0) / sections.length;
            const avgY = sections.reduce((sum, s) => sum + s.coordinates.y, 0) / sections.length;
            
            return (
              <text 
                key={`label-${department.name}`}
                x={avgX + 50} 
                y={avgY - 10} 
                textAnchor="middle" 
                className="text-sm font-bold fill-gray-700"
              >
                {department.name.toUpperCase()}
              </text>
            );
          })}

          {/* Highlighted Aisle Animation */}
          {highlightedAisle && (
            <g>
              {store.layout.departments.flatMap(dept => dept.sections)
                .filter(section => section.aisle === highlightedAisle)
                .map((section) => (
                  <rect
                    key={`highlight-${section.aisle}`}
                    x={section.coordinates.x - 3}
                    y={section.coordinates.y - 3}
                    width="106"
                    height="31"
                    fill="none"
                    stroke="#0071CE"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                  />
                ))}
            </g>
          )}

          {/* Store Boundaries */}
          <rect x="30" y="40" width="660" height="480" fill="none" stroke="#374151" strokeWidth="3" />
        </svg>
      </div>

      <div className="mt-4 text-sm text-gray-600 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p>💡 <strong>Tip:</strong> Click on any aisle to view products</p>
            <p>🔵 <strong>Numbers:</strong> Product count in each aisle</p>
          </div>
          <p className="text-xs">Total Aisles: {store.layout.total_aisles}</p>
        </div>
        
        {highlightedAisle && (
          <p className="text-walmart-blue font-medium">
            📍 <strong>Currently viewing:</strong> Aisle {highlightedAisle} - {
              store.layout.departments
                .flatMap(dept => dept.sections)
                .find(s => s.aisle === highlightedAisle)?.section
            }
          </p>
        )}
        
        <div className="bg-walmart-blue/5 rounded-lg p-3 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>
              <p><strong>Store Hours:</strong></p>
              <p>Mon-Fri: {store.hours.monday}</p>
              <p>Sat-Sun: {store.hours.saturday}</p>
            </div>
            <div>
              <p><strong>Services:</strong></p>
              <p>{store.services.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};