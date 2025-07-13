import React from 'react';
import { Search, Camera, Mic, Sparkles, ShoppingBag, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExampleQueriesProps {
  onQueryClick: (query: string) => void;
  onVisualSearchClick: () => void;
}

export const ExampleQueries: React.FC<ExampleQueriesProps> = ({ 
  onQueryClick, 
  onVisualSearchClick 
}) => {
  const exampleQueries = [
    {
      text: "Show me wireless headphones under $50",
      icon: Search,
      category: "Electronics",
      color: "from-walmart-blue to-walmart-blue-dark",
      accent: "walmart-blue"
    },
    {
      text: "Find organic baby food in aisle 12",
      icon: ShoppingBag,
      category: "Baby & Kids",
      color: "from-green-500 to-green-700",
      accent: "green-600"
    },
    {
      text: "Yellow summer dress size medium",
      icon: Sparkles,
      category: "Fashion",
      color: "from-walmart-yellow to-walmart-yellow-dark",
      accent: "walmart-yellow"
    },
    {
      text: "Gaming laptop with RTX graphics",
      icon: Zap,
      category: "Gaming",
      color: "from-purple-500 to-purple-700",
      accent: "purple-600"
    },
    {
      text: "Protein powder chocolate flavor",
      icon: Search,
      category: "Health",
      color: "from-orange-500 to-orange-700",
      accent: "orange-600"
    },
    {
      text: "Smart TV 55 inch on sale",
      icon: Sparkles,
      category: "Electronics",
      color: "from-walmart-blue to-walmart-blue-dark",
      accent: "walmart-blue"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-walmart-yellow/5 to-walmart-blue/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-32 bg-walmart-yellow/10 rounded-full blur-2xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-10 right-10 w-40 h-40 bg-walmart-blue/10 rounded-full blur-2xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h3 
            className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Try These Popular Searches
          </motion.h3>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Click on any example below or use voice and visual search for a more interactive experience
          </motion.p>
        </motion.div>

        {/* Enhanced Query Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {exampleQueries.map((query, index) => (
            <motion.button
              key={index}
              variants={item}
              onClick={() => onQueryClick(query.text)}
              className="group relative text-left p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 overflow-hidden"
              whileHover={{ 
                scale: 1.03,
                y: -5
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated Background */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${query.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                animate={{
                  background: [
                    `linear-gradient(45deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                    `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                    `linear-gradient(225deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                    `linear-gradient(315deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                    `linear-gradient(45deg, var(--tw-gradient-from), var(--tw-gradient-to))`
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* Icon */}
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${query.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 10
                }}
                animate={{
                  boxShadow: [
                    '0 4px 15px rgba(0,0,0,0.1)',
                    '0 8px 25px rgba(0,0,0,0.15)',
                    '0 4px 15px rgba(0,0,0,0.1)'
                  ]
                }}
                transition={{ 
                  duration: 0.6,
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <query.icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <motion.p 
                  className="font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300"
                  animate={{
                    y: [0, -1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                >
                  "{query.text}"
                </motion.p>
                <motion.span 
                  className={`text-sm font-medium text-${query.accent} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
                  initial={{ opacity: 0.6 }}
                  whileInView={{ opacity: 0.8 }}
                  transition={{ delay: 0.3 }}
                >
                  {query.category}
                </motion.span>
              </div>

              {/* Floating Particles */}
              <motion.div 
                className={`absolute top-3 right-3 w-2 h-2 bg-${query.accent} rounded-full opacity-50`}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3
                }}
              />

              {/* Hover Glow */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${query.color} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 pointer-events-none`}
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Voice Search Button */}
          <motion.button
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(0,76,145,0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              background: [
                'linear-gradient(90deg, #004c91, #0071ce)',
                'linear-gradient(180deg, #004c91, #0071ce)',
                'linear-gradient(270deg, #004c91, #0071ce)',
                'linear-gradient(360deg, #004c91, #0071ce)'
              ]
            }}
            transition={{
              background: { duration: 4, repeat: Infinity, ease: "linear" }
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Mic className="w-5 h-5" />
            </motion.div>
            <span>Try Voice Search</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-walmart-yellow" />
            </motion.div>
          </motion.button>

          {/* Visual Search Button */}
          <motion.button
            onClick={onVisualSearchClick}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-walmart-yellow to-walmart-yellow-dark text-walmart-blue rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(255,194,32,0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              background: [
                'linear-gradient(90deg, #ffc220, #ffdd44)',
                'linear-gradient(180deg, #ffc220, #ffdd44)',
                'linear-gradient(270deg, #ffc220, #ffdd44)',
                'linear-gradient(360deg, #ffc220, #ffdd44)'
              ]
            }}
            transition={{
              background: { duration: 4, repeat: Infinity, ease: "linear" }
            }}
          >
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Camera className="w-5 h-5" />
            </motion.div>
            <span>Try Visual Search</span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-walmart-blue" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};