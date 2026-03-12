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

  // Top-Left and Bottom-Right bolts only
  const lightningBolts = useMemo(() => [
    { id: 'tl', start: [0, 0], end: [50, 50], delay: 0 },
    { id: 'br', start: [100, 100], end: [50, 50], delay: 0.8 },
  ], []);

  // Sparkle particles configuration
  const sparkles = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    angle: (i * 360) / 12,
    delay: Math.random() * 2,
    size: Math.random() * 4 + 2
  })), []);

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
                {/* Secondary Red Glow Bolt */}
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
            
            {/* Center Vehicle Icon (Bike) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="z-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            >
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 64 64" 
                className="fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(-352,-326)">
                  <g transform="translate(18.8303,326)">
                    <g transform="translate(269.17,-192)">
                      <path d="M103.754,214L102.523,210L98,210C96.896,210 96,209.104 96,208C96,206.896 96.896,206 98,206L104,206C104.878,206 105.653,206.573 105.912,207.412L107.939,214L112,214C113.104,214 114,214.896 114,216C114,217.104 113.104,218 112,218L109.169,218L111.634,226.008C111.755,226.003 111.877,226 112,226C116.415,226 120,229.585 120,234C120,238.415 116.415,242 112,242C107.585,242 104,238.415 104,234C104,231.12 105.525,228.594 107.811,227.185L106.609,223.278C102.69,225.254 100,229.315 100,234C100,234 100,234 100,234C100,235.105 99.105,236 98,236L87.748,236C86.858,239.449 83.725,242 80,242C75.585,242 72,238.415 72,234C72,230.275 74.551,227.142 78,226.252L78,224L76,224C75.47,224 74.961,223.789 74.586,223.414C74.211,223.039 74,222.53 74,222C74,221.47 74.211,220.961 74.586,220.586C74.961,220.211 75.47,220 76,220C79.685,220 87.172,220 87.172,220C87.172,220 91.076,216.095 92.586,214.586C92.961,214.211 93.47,214 94,214L103.754,214ZM112,230C114.208,230 116,231.792 116,234C116,236.208 114.208,238 112,238C109.792,238 108,236.208 108,234C108,231.792 109.792,230 112,230ZM80,230C82.208,230 84,231.792 84,234C84,236.208 82.208,238 80,238C77.792,238 76,236.208 76,234C76,231.792 77.792,230 80,230ZM104.984,218L94.828,218C94.828,218 90.924,221.905 89.414,223.414C89.039,223.789 88.53,224 88,224L82,224L82,226.252C84.81,226.977 87.023,229.191 87.748,232L96.124,232C96.826,226.381 100.447,221.663 105.419,219.414L104.984,218Z" />
                    </g>
                  </g>
                </g>
              </svg>
            </motion.div>

            {/* Sparkles Effect */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {sparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
                  style={{
                    width: sparkle.size,
                    height: sparkle.size,
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos(sparkle.angle * (Math.PI / 180)) * 120],
                    y: [0, Math.sin(sparkle.angle * (Math.PI / 180)) * 120],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: sparkle.delay,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

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
