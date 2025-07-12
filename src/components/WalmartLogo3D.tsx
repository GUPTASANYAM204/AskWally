import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const WalmartLogo3D: React.FC = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div 
      ref={logoRef}
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, rotateY: -180 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* 3D Container */}
      <div className="relative w-20 h-20 perspective-1000">
        <motion.div 
          className="w-full h-full relative transform-gpu preserve-3d"
          animate={{ 
            rotateY: [0, 360],
            rotateX: [0, 15, 0, -15, 0]
          }}
          transition={{ 
            rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-walmart-blue via-walmart-blue-light to-walmart-blue-dark rounded-3xl shadow-2xl flex items-center justify-center transform translateZ-10">
            <motion.div
              className="text-white text-3xl font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              W
            </motion.div>
          </div>
          
          {/* Back Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-walmart-yellow via-walmart-yellow-light to-walmart-yellow-dark rounded-3xl shadow-2xl flex items-center justify-center transform rotateY-180 translateZ-10">
            <motion.div
              className="text-walmart-blue text-2xl font-bold"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              ★
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Sparkles */}
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

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-walmart-blue to-walmart-yellow opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Ripple Effect on Hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-walmart-yellow opacity-0 group-hover:opacity-100"
        initial={{ scale: 1 }}
        whileHover={{ 
          scale: [1, 1.5, 2],
          opacity: [1, 0.5, 0]
        }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
};