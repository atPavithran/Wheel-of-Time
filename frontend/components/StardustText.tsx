// components/StardustText.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StardustTextProps {
  children: React.ReactNode;
  className?: string;
  density?: number; // Number of particles per character (default: 2)
  size?: number; // Size of particles (default: 2px)
  color?: string; // Color of particles (default: gold)
  speed?: number; // Animation speed multiplier (default: 1)
}

const StardustText: React.FC<StardustTextProps> = ({
  children,
  className = "",
  density = 2,
  size = 2,
  color = "#FFD700",
  speed = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = React.useState<Array<{id: number, x: number, y: number}>>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Calculate text dimensions
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate number of particles based on container size and density
    const particleCount = Math.floor((width * height) / 500) * density;
    
    // Generate random particles
    const newParticles = Array.from({ length: particleCount }).map((_, index) => ({
      id: index,
      x: Math.random() * width,
      y: Math.random() * height
    }));
    
    setParticles(newParticles);
  }, [children, density]);
  
  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* The actual text content */}
      <span className="relative z-10">{children}</span>
      
      {/* Stardust particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: size,
              height: size,
              backgroundColor: color,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 / speed,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StardustText;