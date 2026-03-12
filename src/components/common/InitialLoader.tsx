"use client"

import React, { useState, useEffect, useMemo } from 'react';
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

  // Function to generate a zig-zag path for lightning
  const generateLightningPath = (startX: number, startY: number, endX: number, endY: number, segments: number = 8, jitter: number = 30) => {
    let path = `M ${startX} ${startY}`;
    const dx = (endX - startX) / segments;
    const dy = (endY - startY) / segments;

    for (let i = 1; i < segments; i++) {
      const x = startX + dx * i + (Math.random() - 0.5) * jitter;
      const y = startY + dy * i + (Math.random() - 0.5) * jitter;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${endX} ${endY}`;
    return path;
  };

  // We use useMemo to avoid regenerating the paths on every render, 
  // but since we want a "flicker" effect, we can actually let them be dynamic or use a key.
  // For the "Thor" feel, we'll create a few variations.
  const lightningBolts = useMemo(() => [
    { id: 'tl', start: [0, 0], end: [50, 50], delay: 0 },
    { id: 'tr', start: [100, 0], end: [50, 50], delay: 0.4 },
    { id: 'bl', start: [0, 100], end: [50, 50], delay: 0.8 },
    { id: 'br', start: [100, 100], end: [50, 50], delay: 1.2 },
  ], []);

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
          {/* Lightning Strikes SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="lightning-glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="1" />
              </linearGradient>
            </defs>

            {lightningBolts.map((bolt) => (
              <React.Fragment key={bolt.id}>
                {/* Core Bolt */}
                <motion.path
                  d={generateLightningPath(bolt.start[0], bolt.start[1], bolt.end[0], bolt.end[1])}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  filter="url(#lightning-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: [0, 1, 1],
                    opacity: [0, 1, 0, 1, 0],
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    repeatDelay: 1.5,
                    delay: bolt.delay,
                    times: [0, 0.2, 0.4, 0.6, 1]
                  }}
                />
                {/* Secondary Blue Glow Bolt */}
                <motion.path
                  d={generateLightningPath(bolt.start[0], bolt.start[1], bolt.end[0], bolt.end[1], 10, 40)}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  opacity="0.5"
                  filter="url(#lightning-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: [0, 1],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    repeatDelay: 1.5,
                    delay: bolt.delay + 0.1
                  }}
                />
              </React.Fragment>
            ))}
          </svg>

          {/* Central Circular Brand Identity */}
          <div className="relative flex items-center justify-center scale-75 md:scale-100">
            {/* Pulsing Core */}
            <motion.div 
              className="absolute w-24 h-24 bg-primary/30 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.8, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
            />
            
            {/* Center Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="z-10 text-white font-headline text-5xl font-black italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            >
              VN
            </motion.div>

            {/* Circular Text */}
            <motion.div
              className="absolute w-80 h-80 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              {characters.map((char, i) => {
                const angle = (i * 360) / characters.length;
                return (
                  <span
                    key={i}
                    className="absolute font-headline text-sm font-black text-primary tracking-widest uppercase"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-150px)`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </motion.div>

            {/* Electric Rings */}
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                className="absolute border border-primary/20 rounded-full"
                style={{ width: `${i * 100 + 100}px`, height: `${i * 100 + 100}px` }}
                animate={{ 
                  rotate: i % 2 === 0 ? 360 : -360,
                  scale: [1, 1.05, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ 
                  rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                  opacity: { duration: 2, repeat: Infinity }
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-12 text-[10px] uppercase tracking-[1em] text-white/40 font-bold"
          >
            Engineering Transcendence
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
