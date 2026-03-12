
"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Characters for the circular text
  const text = "VERIDIAN • NOIR • ";
  const repeatedText = text.repeat(2);
  const characters = repeatedText.split("");

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#020202] flex items-center justify-center overflow-hidden"
        >
          {/* Lightning Beams SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="cornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>

            {/* Top Left Strike */}
            <motion.line
              x1="0" y1="0" x2="50%" y2="50%"
              stroke="url(#cornerGrad)"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1], 
                opacity: [0, 1, 0],
                strokeWidth: [1, 4, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1, ease: "circIn" }}
            />
            {/* Top Right Strike */}
            <motion.line
              x1="100%" y1="0" x2="50%" y2="50%"
              stroke="url(#cornerGrad)"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1], 
                opacity: [0, 1, 0],
                strokeWidth: [1, 4, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.2, delay: 0.3, ease: "circIn" }}
            />
            {/* Bottom Left Strike */}
            <motion.line
              x1="0" y1="100%" x2="50%" y2="50%"
              stroke="url(#cornerGrad)"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1], 
                opacity: [0, 1, 0],
                strokeWidth: [1, 4, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.8, delay: 0.6, ease: "circIn" }}
            />
            {/* Bottom Right Strike */}
            <motion.line
              x1="100%" y1="100%" x2="50%" y2="50%"
              stroke="url(#cornerGrad)"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1], 
                opacity: [0, 1, 0],
                strokeWidth: [1, 4, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.1, delay: 0.1, ease: "circIn" }}
            />
          </svg>

          {/* Central Circular Brand Identity */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing Core */}
            <motion.div 
              className="absolute w-24 h-24 bg-primary/20 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Center Logo/Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="z-10 text-primary font-headline text-4xl font-black italic tracking-tighter"
            >
              VN
            </motion.div>

            {/* Circular Text */}
            <motion.div
              className="absolute w-80 h-80 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {characters.map((char, i) => {
                const angle = (i * 360) / characters.length;
                return (
                  <span
                    key={i}
                    className="absolute font-headline text-xs font-black text-primary tracking-widest uppercase"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-140px)`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </motion.div>

            {/* Glowing Rings */}
            <motion.div 
              className="absolute w-64 h-64 border border-primary/10 rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="absolute bottom-12 text-[10px] uppercase tracking-[0.8em] text-muted-foreground/50 font-bold"
          >
            Engineering Transcendence
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
