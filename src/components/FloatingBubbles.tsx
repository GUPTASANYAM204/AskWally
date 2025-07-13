import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const FloatingBubbles: React.FC<{ count: number }> = ({ count }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setBubbles(newBubbles);
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          initial={{ 
            x: `${bubble.x}vw`, 
            y: `${bubble.y}vh`,
            opacity: 0.3
          }}
          animate={{
            y: `${bubble.y - 100}vh`,
            opacity: [0.3, 0.6, 0.3],
            x: `${bubble.x + (Math.random() * 20 - 10)}vw`
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear'
          }}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,114,206,0.2) 0%, rgba(255,200,0,0.1) 100%)',
            position: 'absolute',
          }}
        />
      ))}
    </div>
  );
};