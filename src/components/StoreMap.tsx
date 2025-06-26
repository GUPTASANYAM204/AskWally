import React from 'react';

interface StoreMapProps {
  highlightedAisle?: string | null;
  onAisleClick: (aisle: string) => void;
}

export const StoreMap: React.FC<StoreMapProps> = ({ highlightedAisle, onAisleClick }) => {
  const aisles = [
    // Grocery Section (Left side)
    { id: 'A1', name: 'Produce - Fresh Fruits', x: 50, y: 120, width: 120, height: 25, section: 'grocery' },
    { id: 'A2', name: 'Produce - Fresh Vegetables', x: 50, y: 150, width: 120, height: 25, section: 'grocery' },
    { id: 'A3', name: 'Dairy & Refrigerated', x: 50, y: 180, width: 120, height: 25, section: 'grocery' },
    { id: 'A4', name: 'Frozen Foods', x: 50, y: 210, width: 120, height: 25, section: 'grocery' },
    { id: 'A5', name: 'Meat & Seafood', x: 50, y: 240, width: 120, height: 25, section: 'grocery' },
    { id: 'A6', name: 'Deli & Bakery', x: 50, y: 270, width: 120, height: 25, section: 'grocery' },
    { id: 'A12', name: 'Cookies & Snacks', x: 50, y: 300, width: 120, height: 25, section: 'grocery' },
    { id: 'A14', name: 'Nuts & Trail Mix', x: 50, y: 330, width: 120, height: 25, section: 'grocery' },

    // Electronics Section (Top center)
    { id: 'E1', name: 'TVs & Home Theater', x: 200, y: 120, width: 100, height: 25, section: 'electronics' },
    { id: 'E2', name: 'Computers & Laptops', x: 320, y: 120, width: 100, height: 25, section: 'electronics' },
    { id: 'E3', name: 'Cell Phones', x: 440, y: 120, width: 100, height: 25, section: 'electronics' },
    { id: 'E4', name: 'Audio & Headphones', x: 200, y: 150, width: 100, height: 25, section: 'electronics' },
    { id: 'E5', name: 'Gaming & Consoles', x: 320, y: 150, width: 100, height: 25, section: 'electronics' },
    { id: 'E6', name: 'Cameras & Photo', x: 440, y: 150, width: 100, height: 25, section: 'electronics' },

    // Clothing Section (Center)
    { id: 'C6', name: 'Women\'s Tops', x: 200, y: 200, width: 80, height: 25, section: 'clothing' },
    { id: 'C7', name: 'Men\'s T-Shirts', x: 300, y: 200, width: 80, height: 25, section: 'clothing' },
    { id: 'C8', name: 'Hoodies & Sweatshirts', x: 400, y: 200, width: 80, height: 25, section: 'clothing' },
    { id: 'C9', name: 'Jeans & Denim', x: 200, y: 230, width: 80, height: 25, section: 'clothing' },
    { id: 'C10', name: 'Dress Pants', x: 300, y: 230, width: 80, height: 25, section: 'clothing' },
    { id: 'C11', name: 'Shoes & Footwear', x: 400, y: 230, width: 80, height: 25, section: 'clothing' },

    // Home & Garden Section (Right side)
    { id: 'H3', name: 'Kitchen & Dining', x: 560, y: 120, width: 100, height: 25, section: 'home' },
    { id: 'H6', name: 'Small Appliances', x: 560, y: 150, width: 100, height: 25, section: 'home' },
    { id: 'H8', name: 'Home Decor & Lighting', x: 560, y: 180, width: 100, height: 25, section: 'home' },
    { id: 'H12', name: 'Bedding & Bath', x: 560, y: 210, width: 100, height: 25, section: 'home' },
    { id: 'H15', name: 'Storage & Organization', x: 560, y: 240, width: 100, height: 25, section: 'home' },

    // Toys Section (Bottom left)
    { id: 'T3', name: 'Educational Toys', x: 50, y: 380, width: 90, height: 25, section: 'toys' },
    { id: 'T5', name: 'Remote Control Toys', x: 160, y: 380, width: 90, height: 25, section: 'toys' },
    { id: 'T8', name: 'Building Blocks', x: 270, y: 380, width: 90, height: 25, section: 'toys' },
    { id: 'T10', name: 'Action Figures', x: 380, y: 380, width: 90, height: 25, section: 'toys' },

    // Health & Beauty Section (Bottom center)
    { id: 'HB2', name: 'Oral Care', x: 200, y: 300, width: 80, height: 25, section: 'health' },
    { id: 'HB5', name: 'Vitamins & Supplements', x: 300, y: 300, width: 80, height: 25, section: 'health' },
    { id: 'HB7', name: 'Skincare & Beauty', x: 400, y: 300, width: 80, height: 25, section: 'health' },
    { id: 'HB9', name: 'Personal Care', x: 200, y: 330, width: 80, height: 25, section: 'health' },

    // Sports & Outdoors Section (Bottom right)
    { id: 'S2', name: 'Fitness Equipment', x: 520, y: 300, width: 90, height: 25, section: 'sports' },
    { id: 'S4', name: 'Exercise & Yoga', x: 520, y: 330, width: 90, height: 25, section: 'sports' },
    { id: 'S8', name: 'Camping & Outdoor', x: 520, y: 360, width: 90, height: 25, section: 'sports' },
    { id: 'S12', name: 'Sports Equipment', x: 520, y: 390, width: 90, height: 25, section: 'sports' },

    // Outdoor/Seasonal Section
    { id: 'D12', name: 'Rain Gear & Outerwear', x: 380, y: 260, width: 100, height: 25, section: 'seasonal' },
  ];

  const departments = [
    { name: 'Grocery', color: 'bg-green-100 border-green-300', textColor: 'text-green-800', section: 'grocery' },
    { name: 'Electronics', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800', section: 'electronics' },
    { name: 'Clothing', color: 'bg-purple-100 border-purple-300', textColor: 'text-purple-800', section: 'clothing' },
    { name: 'Home & Garden', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800', section: 'home' },
    { name: 'Toys', color: 'bg-pink-100 border-pink-300', textColor: 'text-pink-800', section: 'toys' },
    { name: 'Health & Beauty', color: 'bg-red-100 border-red-300', textColor: 'text-red-800', section: 'health' },
    { name: 'Sports & Outdoors', color: 'bg-teal-100 border-teal-300', textColor: 'text-teal-800', section: 'sports' },
    { name: 'Seasonal', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800', section: 'seasonal' },
  ];

  const getAisleColor = (aisle: any) => {
    if (highlightedAisle === aisle.id) {
      return 'fill-walmart-blue stroke-walmart-blue-dark stroke-2';
    }
    
    switch (aisle.section) {
      case 'grocery': return 'fill-green-200 stroke-green-400 hover:fill-green-300';
      case 'electronics': return 'fill-blue-200 stroke-blue-400 hover:fill-blue-300';
      case 'clothing': return 'fill-purple-200 stroke-purple-400 hover:fill-purple-300';
      case 'home': return 'fill-orange-200 stroke-orange-400 hover:fill-orange-300';
      case 'toys': return 'fill-pink-200 stroke-pink-400 hover:fill-pink-300';
      case 'health': return 'fill-red-200 stroke-red-400 hover:fill-red-300';
      case 'sports': return 'fill-teal-200 stroke-teal-400 hover:fill-teal-300';
      case 'seasonal': return 'fill-yellow-200 stroke-yellow-400 hover:fill-yellow-300';
      default: return 'fill-gray-200 stroke-gray-400 hover:fill-gray-300';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Walmart Supercenter - Store Layout</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {departments.map((dept) => (
            <div
              key={dept.name}
              className={`px-3 py-1 rounded-full border-2 ${dept.color} ${dept.textColor} text-xs font-medium`}
            >
              {dept.name}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 overflow-auto" style={{ minHeight: '500px' }}>
        <svg viewBox="0 0 720 450" className="w-full h-full">
          {/* Store Entrance */}
          <rect x="310" y="20" width="100" height="20" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
          <text x="360" y="35" textAnchor="middle" className="text-sm font-bold fill-gray-700">
            MAIN ENTRANCE
          </text>

          {/* Customer Service */}
          <rect x="50" y="50" width="80" height="30" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <text x="90" y="70" textAnchor="middle" className="text-xs font-medium fill-yellow-800">
            Customer Service
          </text>

          {/* Checkout Area */}
          <rect x="200" y="50" width="320" height="30" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <text x="360" y="70" textAnchor="middle" className="text-sm font-bold fill-yellow-800">
            CHECKOUT LANES
          </text>

          {/* Pharmacy */}
          <rect x="580" y="50" width="80" height="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
          <text x="620" y="70" textAnchor="middle" className="text-xs font-medium fill-green-800">
            Pharmacy
          </text>

          {/* McDonald's */}
          <rect x="50" y="90" width="80" height="20" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
          <text x="90" y="105" textAnchor="middle" className="text-xs font-medium fill-red-800">
            McDonald's
          </text>

          {/* Restrooms */}
          <rect x="580" y="90" width="80" height="20" fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" />
          <text x="620" y="105" textAnchor="middle" className="text-xs font-medium fill-gray-700">
            Restrooms
          </text>

          {/* Aisles */}
          {aisles.map((aisle) => (
            <g key={aisle.id}>
              <rect
                x={aisle.x}
                y={aisle.y}
                width={aisle.width}
                height={aisle.height}
                className={`${getAisleColor(aisle)} cursor-pointer transition-all duration-200`}
                onClick={() => onAisleClick(aisle.id)}
              />
              <text
                x={aisle.x + aisle.width / 2}
                y={aisle.y + aisle.height / 2 - 3}
                textAnchor="middle"
                className="text-xs font-bold fill-gray-700 pointer-events-none"
              >
                {aisle.id}
              </text>
              <text
                x={aisle.x + aisle.width / 2}
                y={aisle.y + aisle.height / 2 + 8}
                textAnchor="middle"
                className="text-xs fill-gray-600 pointer-events-none"
                style={{ fontSize: '10px' }}
              >
                {aisle.name.length > 15 ? aisle.name.substring(0, 15) + '...' : aisle.name}
              </text>
            </g>
          ))}

          {/* Section Labels */}
          <text x="110" y="115" textAnchor="middle" className="text-sm font-bold fill-green-700">GROCERY</text>
          <text x="360" y="115" textAnchor="middle" className="text-sm font-bold fill-blue-700">ELECTRONICS</text>
          <text x="610" y="115" textAnchor="middle" className="text-sm font-bold fill-orange-700">HOME</text>
          <text x="340" y="195" textAnchor="middle" className="text-sm font-bold fill-purple-700">CLOTHING</text>
          <text x="195" y="375" textAnchor="middle" className="text-sm font-bold fill-pink-700">TOYS</text>
          <text x="340" y="295" textAnchor="middle" className="text-sm font-bold fill-red-700">HEALTH & BEAUTY</text>
          <text x="565" y="295" textAnchor="middle" className="text-sm font-bold fill-teal-700">SPORTS</text>

          {/* Highlighted Aisle Animation */}
          {highlightedAisle && (
            <g>
              {aisles
                .filter(aisle => aisle.id === highlightedAisle)
                .map((aisle) => (
                  <rect
                    key={`highlight-${aisle.id}`}
                    x={aisle.x - 3}
                    y={aisle.y - 3}
                    width={aisle.width + 6}
                    height={aisle.height + 6}
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
          <rect x="30" y="40" width="650" height="380" fill="none" stroke="#374151" strokeWidth="3" />
        </svg>
      </div>

      <div className="mt-4 text-sm text-gray-600 space-y-2">
        <div className="flex items-center space-x-4">
          <p>💡 <strong>Tip:</strong> Click on any aisle to view more details</p>
          <p>🚶‍♂️ <strong>Navigation:</strong> Follow the main aisles for easy access</p>
        </div>
        {highlightedAisle && (
          <p className="text-walmart-blue font-medium">
            📍 <strong>Currently viewing:</strong> Aisle {highlightedAisle} - {aisles.find(a => a.id === highlightedAisle)?.name}
          </p>
        )}
        <div className="bg-walmart-blue/5 rounded-lg p-3 mt-4">
          <p className="text-xs text-gray-600">
            <strong>Store Hours:</strong> Mon-Sun 6:00 AM - 11:00 PM | 
            <strong> Customer Service:</strong> 8:00 AM - 8:00 PM | 
            <strong> Pharmacy:</strong> 9:00 AM - 9:00 PM
          </p>
        </div>
      </div>
    </div>
  );
};