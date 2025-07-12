import React, { useState } from 'react';
import { Search, Sparkles, Loader2, Mic, Camera } from 'lucide-react';
import { VoiceAssistant } from './VoiceAssistant';
import { VisualSearchButton } from './VisualSearchButton';
import { VisualSearch } from './VisualSearch';
import { motion, AnimatePresence } from 'framer-motion';
import WalmartLogo from '../assets/walmart-logo.png.png';
import WalmartSpark from '../assets/walmart-spark.png';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
      <section className="relative overflow-hidden py-20 lg:py-32 min-h-screen flex items-center">
        {/* Animated Background with Smooth Gradients */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Primary Gradient Background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-walmart-blue/10 via-white to-walmart-yellow/10"
            animate={{
              background: [
                'linear-gradient(135deg, rgba(0,76,145,0.1) 0%, rgba(255,255,255,1) 50%, rgba(255,194,32,0.1) 100%)',
                'linear-gradient(225deg, rgba(255,194,32,0.1) 0%, rgba(255,255,255,1) 50%, rgba(0,76,145,0.1) 100%)',
                'linear-gradient(315deg, rgba(0,76,145,0.1) 0%, rgba(255,255,255,1) 50%, rgba(255,194,32,0.1) 100%)',
                'linear-gradient(45deg, rgba(255,194,32,0.1) 0%, rgba(255,255,255,1) 50%, rgba(0,76,145,0.1) 100%)',
                'linear-gradient(135deg, rgba(0,76,145,0.1) 0%, rgba(255,255,255,1) 50%, rgba(255,194,32,0.1) 100%)'
              ]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Animated Orbs */}
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-walmart-yellow/30 to-walmart-yellow-dark/30 rounded-full blur-2xl"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-walmart-blue/30 to-walmart-blue-dark/30 rounded-full blur-2xl"
            animate={{
              y: [0, 40, 0],
              x: [0, -30, 0],
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 15,
              delay: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating Sparkles */}
          <motion.div 
            className="absolute top-1/4 right-1/4"
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-8 h-8 text-walmart-yellow/60" />
          </motion.div>

          <motion.div 
            className="absolute bottom-1/4 left-1/4"
            animate={{
              y: [0, 25, 0],
              x: [0, -10, 0],
              rotate: [360, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-6 h-6 text-walmart-blue/60" />
          </motion.div>
        </motion.div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10">
          {/* Enhanced Logo and Brand Section */}
          <motion.div 
            className="flex items-center justify-center space-x-6 mb-8"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Animated Walmart Logo with Spark inside the rectangle */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative w-20 h-20 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden"
                animate={{
                  boxShadow: [
                    '0 10px 30px rgba(0,76,145,0.3)',
                    '0 20px 60px rgba(0,76,145,0.5)',
                    '0 10px 30px rgba(0,76,145,0.3)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Centered Spark PNG */}
                <img
                  src={WalmartSpark}
                  alt="Walmart Spark"
                  className="w-full h-full object-contain z-10"
                  style={{ pointerEvents: 'none' }}
                />
                {/* Glowing Ring Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-walmart-yellow opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
              {/* Floating Sparkles around Logo */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-6 h-6 text-walmart-yellow drop-shadow-lg" />
              </motion.div>

              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{ 
                  rotate: [360, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Sparkles className="w-4 h-4 text-walmart-blue drop-shadow-lg" />
              </motion.div>
            </motion.div>

            {/* Brand Text with Enhanced Animation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative"
            >
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-walmart-blue via-walmart-blue-light to-walmart-yellow bg-clip-text text-transparent relative"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                AskWally
                
                {/* Animated Text Glow */}
                <motion.div
                  className="absolute inset-0 text-5xl lg:text-7xl font-bold bg-gradient-to-r from-walmart-yellow to-walmart-blue bg-clip-text text-transparent opacity-0"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  AskWally
                </motion.div>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-walmart-blue font-semibold mt-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                AI Shopping Assistant
              </motion.p>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-3 h-3 bg-walmart-yellow rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Enhanced Tagline */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
              animate={{
                textShadow: [
                  '0 0 0 rgba(0,76,145,0)',
                  '2px 2px 8px rgba(0,76,145,0.2)',
                  '0 0 0 rgba(0,76,145,0)',
                  '-2px -2px 8px rgba(255,194,32,0.2)',
                  '0 0 0 rgba(0,76,145,0)'
                ]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Smart Search. Easy Shopping.
            </motion.h2>
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Experience the future of shopping with AI-powered search, voice commands, and visual recognition. 
            Find exactly what you need at your local Walmart with precise aisle locations.
          </motion.p>

          {/* Enhanced Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-8">
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={isFocused ? { 
                  boxShadow: '0 25px 50px rgba(0,76,145,0.2)'
                } : {}}
              >
                <motion.input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Try: 'Show me wireless headphones under $50 '"
                  className="w-full px-8 py-6 pl-16 pr-40 text-l rounded-3xl border-3 border-walmart-blue/20 bg-white/90 backdrop-blur-lg shadow-2xl focus:outline-none focus:border-walmart-blue focus:ring-4 focus:ring-walmart-yellow/30 transition-all duration-500 group-hover:shadow-3xl"
                  disabled={isSearching}
                />
                
                {/* Animated Search Icon */}
                <motion.div
                  className="absolute left-6 top-1/2 transform -translate-y-1/2"
                  animate={{ 
                    rotate: isSearching ? 360 : 0,
                    scale: isFocused ? 1.2 : 1
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: isSearching ? Infinity : 0 },
                    scale: { duration: 0.3 }
                  }}
                >
                  <Search className="w-6 h-6 text-walmart-blue" />
                </motion.div>
                
                {/* Action Buttons Container */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                  {/* Voice Assistant */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <VoiceAssistant onSearch={handleVoiceSearch} isSearching={isSearching} />
                  </motion.div>
                  
                  {/* Visual Search Button */}
                  <motion.button
                    type="button"
                    onClick={() => setIsVisualSearchOpen(true)}
                    className="p-3 bg-gradient-to-br from-walmart-yellow to-walmart-yellow-dark text-walmart-blue rounded-2xl hover:shadow-xl transition-all duration-300"
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: '0 10px 25px rgba(255,194,32,0.4)'
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-5 h-5" />
                  </motion.button>
                  
                  {/* Search Button */}
                  <motion.button
                    type="submit"
                    disabled={!query.trim() || isSearching}
                    className="px-8 py-3 bg-gradient-to-r from-walmart-blue via-walmart-blue-light to-walmart-blue-dark text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 15px 35px rgba(0,76,145,0.4)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={isSearching ? { 
                      background: 'linear-gradient(45deg, #004c91, #0071ce, #004c91)',
                      backgroundSize: '200% 200%',
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    } : {}}
                    transition={{ 
                      backgroundPosition: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {isSearching ? (
                        <motion.div
                          key="searching"
                          initial={{ opacity: 0, rotate: -180 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 180 }}
                          className="flex items-center space-x-2"
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Searching...</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="search"
                          initial={{ opacity: 0, rotate: -180 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 180 }}
                          className="flex items-center space-x-2"
                        >
                          <Search className="w-5 h-5" />
                          <span>Search</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Glowing Border Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-walmart-yellow opacity-0 pointer-events-none"
                  animate={isFocused ? { 
                    opacity: [0, 1, 0],
                    scale: [1, 1.02, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Search Status */}
              <AnimatePresence>
                {isSearching && (
                  <motion.div 
                    className="mt-6 flex items-center justify-center space-x-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 text-walmart-yellow" />
                    </motion.div>
                    <motion.span 
                      className="text-lg font-semibold bg-gradient-to-r from-walmart-blue to-walmart-yellow bg-clip-text text-transparent"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      AI is processing your request...
                    </motion.span>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 text-walmart-blue" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Search Tips */}
            <motion.div 
              className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-12 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              {[
                { icon: Mic, text: "Voice Search", desc: "Click microphone for voice commands", color: "walmart-blue" },
                { icon: Camera, text: "Visual Search", desc: "Upload images to find similar products", color: "walmart-yellow" },
                { icon: Sparkles, text: "AI Powered", desc: "Natural language understanding", color: "walmart-blue" }
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7 + index * 0.2 }}
                >
                  <motion.div 
                    className={`w-12 h-12 bg-gradient-to-br from-${tip.color} to-${tip.color}-dark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    animate={{
                      boxShadow: [
                        '0 4px 15px rgba(0,0,0,0.1)',
                        '0 8px 25px rgba(0,0,0,0.15)',
                        '0 4px 15px rgba(0,0,0,0.1)'
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    <tip.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-800">{tip.text}</p>
                    <p className="text-sm text-gray-600">{tip.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
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