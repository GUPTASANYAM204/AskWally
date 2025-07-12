import React from 'react';
import { Brain, MapPin, Filter, Zap, Camera, Sparkles, Mic, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Search",
      description: "Advanced natural language processing understands exactly what you're looking for",
      color: "from-walmart-blue to-walmart-blue-dark",
      accent: "walmart-blue",
      delay: 0
    },
    {
      icon: Camera,
      title: "Visual Search",
      description: "Upload or capture images to find similar products instantly with AI recognition",
      color: "from-walmart-yellow to-walmart-yellow-dark",
      accent: "walmart-yellow",
      delay: 0.1
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Speak naturally to search for products using advanced voice recognition technology",
      color: "from-purple-500 to-purple-700",
      accent: "purple-600",
      delay: 0.2
    },
    {
      icon: MapPin,
      title: "Store Locations",
      description: "Find products available at your nearest Walmart with precise aisle information",
      color: "from-green-500 to-green-700",
      accent: "green-600",
      delay: 0.3
    },
    {
      icon: Filter,
      title: "Smart Filtering",
      description: "Advanced filters for price, color, brand, ratings, and real-time availability",
      color: "from-orange-500 to-orange-700",
      accent: "orange-600",
      delay: 0.4
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive product information and location details in milliseconds",
      color: "from-walmart-yellow to-walmart-yellow-dark",
      accent: "walmart-yellow",
      delay: 0.5
    },
    {
      icon: Sparkles,
      title: "Smart Recommendations",
      description: "AI-powered suggestions based on your preferences and shopping history",
      color: "from-pink-500 to-pink-700",
      accent: "pink-600",
      delay: 0.6
    },
    {
      icon: ShoppingCart,
      title: "Seamless Shopping",
      description: "Add to cart, check availability, and complete purchases all in one place",
      color: "from-walmart-blue to-walmart-blue-dark",
      accent: "walmart-blue",
      delay: 0.7
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-walmart-yellow/5 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <motion.div 
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-walmart-blue/10 to-walmart-blue-dark/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -50, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-walmart-yellow/10 to-walmart-yellow-dark/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, 50, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h3 
            className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
            animate={{
              textShadow: [
                '0 0 0 rgba(0,76,145,0)',
                '3px 3px 6px rgba(0,76,145,0.2)',
                '0 0 0 rgba(0,76,145,0)',
                '-3px -3px 6px rgba(255,194,32,0.2)',
                '0 0 0 rgba(0,76,145,0)'
              ]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Why Choose AskWally?
          </motion.h3>
          <motion.p 
            className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Experience the future of smart shopping with our revolutionary AI-powered assistant
          </motion.p>
        </motion.div>
        
        {/* Enhanced Feature Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="group relative"
              whileHover={{ 
                scale: 1.05,
                y: -10
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              {/* Card Container */}
              <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 overflow-hidden h-full">
                {/* Animated Background Gradient */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
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
                
                {/* Icon Container */}
                <motion.div 
                  className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 10
                  }}
                  animate={{
                    boxShadow: [
                      '0 10px 25px rgba(0,0,0,0.1)',
                      '0 20px 40px rgba(0,0,0,0.15)',
                      '0 10px 25px rgba(0,0,0,0.1)'
                    ]
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeInOut",
                    boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: feature.delay
                    }}
                  >
                    <feature.icon className="w-10 h-10 text-white drop-shadow-lg" />
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <motion.h4 
                    className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300"
                    animate={{
                      y: [0, -2, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: feature.delay
                    }}
                  >
                    {feature.title}
                  </motion.h4>
                  <motion.p 
                    className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300"
                    initial={{ opacity: 0.8 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 + feature.delay }}
                  >
                    {feature.description}
                  </motion.p>
                </div>
                
                {/* Floating Particles */}
                <motion.div 
                  className={`absolute top-4 right-4 w-3 h-3 bg-${feature.accent} rounded-full opacity-60`}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.6, 1, 0.6],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: feature.delay
                  }}
                />
                
                <motion.div 
                  className={`absolute bottom-4 left-4 w-2 h-2 bg-${feature.accent} rounded-full opacity-40`}
                  animate={{
                    y: [0, 10, 0],
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: feature.delay + 1
                  }}
                />

                {/* Hover Glow Effect */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 pointer-events-none`}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0, 0.05, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Border Effect */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl border border-transparent group-hover:border-${feature.accent}/20 transition-all duration-500 pointer-events-none`}
                  animate={{
                    borderColor: [
                      'rgba(255,194,32,0)',
                      'rgba(255,194,32,0.1)',
                      'rgba(255,194,32,0)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          viewport={{ once: true }}
        >
         
        </motion.div>
      </div>
    </section>
  );
};