import React, { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { VoiceAssistant } from './VoiceAssistant';
import { VisualSearchButton } from './VisualSearchButton';
import { VisualSearch } from './VisualSearch';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query.trim());
    }
  };

  const handleVoiceSearch = (voiceQuery: string) => {
    setQuery(voiceQuery);
    onSearch(voiceQuery);
  };

  return (
    <>
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-walmart-blue/5 to-walmart-yellow/5"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-walmart-yellow/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-walmart-blue/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center space-x-3 mb-6 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-walmart-blue via-walmart-blue-dark to-accent-purple bg-clip-text text-transparent">
                AskWally
              </h1>
              <p className="text-sm text-gray-600 font-medium">AI Shopping Assistant</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 animate-slide-up">
            Smart Search. Easy Shopping.
          </h2>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Tell me what you're looking for in plain English, upload an image, or use your voice to find the perfect products 
            available at your local Walmart with precise aisle locations.
          </p>

          {/* Search Form with Voice Assistant and Visual Search */}
          <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-6">
              <div className="relative group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try: 'Show me a yellow top under $15 available near me'"
                  className="w-full px-6 py-4 pl-14 pr-32 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:border-walmart-blue focus:ring-4 focus:ring-walmart-blue/20 transition-all duration-300 group-hover:shadow-xl"
                  disabled={isSearching}
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                {/* Voice Assistant and Search Button Container */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {/* Voice Assistant */}
                  <VoiceAssistant onSearch={handleVoiceSearch} isSearching={isSearching} />
                  
                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={!query.trim() || isSearching}
                    className="px-6 py-2 bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Search Status */}
              {isSearching && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-walmart-blue animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">AI is processing your request...</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
            </form>

            {/* Visual Search Button */}
            <div className="flex justify-center mb-6">
              <VisualSearchButton onClick={() => setIsVisualSearchOpen(true)} />
            </div>

            {/* Search Tips */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-walmart-blue rounded-full animate-pulse"></div>
                <span className="text-sm">
                  💬 <strong>Voice:</strong> Click the microphone to search with your voice
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-walmart-yellow rounded-full animate-pulse"></div>
                <span className="text-sm">
                  📷 <strong>Visual:</strong> Upload or capture an image to find similar products
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Search Modal */}
      <VisualSearch 
        isOpen={isVisualSearchOpen} 
        onClose={() => setIsVisualSearchOpen(false)} 
      />
    </>
  );
};