import React from 'react';
import { Shirt, Smartphone, Coffee, Gamepad2, Dumbbell, Heart, Camera } from 'lucide-react';

interface ExampleQueriesProps {
  onQueryClick: (query: string) => void;
  onVisualSearchClick: () => void;
}

export const ExampleQueries: React.FC<ExampleQueriesProps> = ({ onQueryClick, onVisualSearchClick }) => {
  const examples = [
    {
      icon: Shirt,
      query: "Find a yellow top under $15",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Smartphone,
      query: "Show me Samsung TVs under $500",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Coffee,
      query: "Coffee maker under $50 with good reviews",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Gamepad2,
      query: "Nintendo Switch games for kids",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Dumbbell,
      query: "Fitness equipment for home workout",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Heart,
      query: "Vitamin supplements for health",
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Try These Example Searches</h3>
          <p className="text-gray-600">Click any example to see AskWally in action, or try our new visual search feature</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => onQueryClick(example.query)}
              className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${example.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <example.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-800 font-medium leading-relaxed group-hover:text-walmart-blue transition-colors duration-200">
                "{example.query}"
              </p>
            </button>
          ))}
        </div>

        {/* Visual Search Showcase */}
        <div className="mt-12 bg-gradient-to-r from-walmart-blue/5 to-walmart-yellow/5 rounded-2xl p-8 border border-walmart-blue/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">New: Visual Search</h4>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't describe what you're looking for? Upload a photo or use your camera to find similar products instantly with our AI-powered visual search.
            </p>
            <button
              onClick={onVisualSearchClick}
              className="bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Camera className="w-5 h-5" />
              <span>Try Visual Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};