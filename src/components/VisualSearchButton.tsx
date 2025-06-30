import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface VisualSearchButtonProps {
  onClick: () => void;
}

export const VisualSearchButton: React.FC<VisualSearchButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 overflow-hidden"
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-walmart-blue-dark to-walmart-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative flex items-center space-x-2">
        <div className="relative">
          <Camera className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-walmart-yellow animate-pulse" />
        </div>
        <span>Visual Search</span>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
    </button>
  );
};