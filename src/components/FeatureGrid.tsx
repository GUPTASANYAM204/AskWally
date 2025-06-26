import React from 'react';
import { Brain, MapPin, Filter, Zap } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Search",
      description: "Natural language processing understands exactly what you're looking for",
      color: "from-walmart-blue to-walmart-blue-dark"
    },
    {
      icon: MapPin,
      title: "Store Locations",
      description: "Find products available at your nearest Walmart with precise aisle information",
      color: "from-accent-success to-green-600"
    },
    {
      icon: Filter,
      title: "Smart Filtering",
      description: "Advanced filters for price, color, brand, ratings, and availability",
      color: "from-accent-purple to-purple-600"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive product information and location details in seconds",
      color: "from-walmart-yellow to-walmart-yellow-dark"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Why Choose AskWally?</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of smart shopping with our AI-powered assistant
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/50 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};