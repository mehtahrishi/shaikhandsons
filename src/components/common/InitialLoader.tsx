"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Phase 1: Main Loader Duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5500);

    // Phase 2: Transition from Bike to Text
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
    };
  }, []);

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

  // Diagonals for lightning: Top-Left (TL) and Bottom-Right (BR)
  const lightningBolts = useMemo(() => [
    { id: 'tl', start: [0, 0], end: [50, 50], delay: 1 },
    { id: 'br', start: [100, 100], end: [50, 50], delay: 1.5 },
  ], []);

  // Sparkle configuration for each strike
  const sparkleCount = 12;

  // Hydration safe check
  if (!mounted) {
    return null;
  }

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
                    delay: bolt.delay,
                    times: [0, 0.2, 0.4, 0.6, 1]
                  }}
                />
                {/* Primary Red Glow Bolt */}
                <motion.path
                  d={generateLightningPath(bolt.start[0], bolt.start[1], bolt.end[0], bolt.end[1], 10, 40)}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.2"
                  opacity="0.6"
                  filter="url(#lightning-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: [0, 1],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: bolt.delay + 0.05
                  }}
                />
              </React.Fragment>
            ))}
          </svg>

          {/* Central Content Area */}
          <div className="relative flex items-center justify-center scale-75 md:scale-100 min-w-[300px] h-[300px]">
            <AnimatePresence mode="wait">
              {!showText ? (
                <motion.div
                  key="bike-container"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className="relative flex items-center justify-center"
                >
                  {/* Impact Sparkles - Triggered per bolt impact */}
                  {lightningBolts.map((bolt) => (
                    <div key={`sparkles-${bolt.id}`} className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: sparkleCount }).map((_, i) => {
                        const sWidth = Math.random() * 4 + 2;
                        const sHeight = Math.random() * 4 + 2;
                        
                        return (
                          <motion.div
                            key={`${bolt.id}-sparkle-${i}`}
                            className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
                            style={{
                              width: sWidth,
                              height: sHeight,
                              left: '50%',
                              top: '50%',
                            }}
                            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                            animate={{
                              x: [0, Math.cos((i * 360 / sparkleCount) * (Math.PI / 180)) * 150],
                              y: [0, Math.sin((i * 360 / sparkleCount) * (Math.PI / 180)) * 150],
                              opacity: [0, 1, 0],
                              scale: [0, 1.5, 0.2],
                            }}
                            transition={{
                              duration: 0.8,
                              delay: bolt.delay + 0.15,
                              ease: "easeOut"
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}

                  {/* Pulsing Red Core behind Bike */}
                  <motion.div 
                    className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* The Bike Icon */}
                  <div className="z-10 text-white">
                    <svg 
                      width="120" 
                      height="120" 
                      viewBox="0 0 64 64" 
                      className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(-352,-326)">
                        <g transform="translate(18.8303,326)">
                          <g transform="translate(269.17,-192)">
                            <motion.path 
                              d="M103.754,214L102.523,210L98,210C96.896,210 96,209.104 96,208C96,206.896 96.896,206 98,206L104,206C104.878,206 105.653,206.573 105.912,207.412L107.939,214L112,214C113.104,214 114,214.896 114,216C114,217.104 113.104,218 112,218L109.169,218L111.634,226.008C111.755,226.003 111.877,226 112,226C116.415,226 120,229.585 120,234C120,238.415 116.415,242 112,242C107.585,242 104,238.415 104,234C104,231.12 105.525,228.594 107.811,227.185L106.609,223.278C102.69,225.254 100,229.315 100,234C100,234 100,234 100,234C100,235.105 99.105,236 98,236L87.748,236C86.858,239.449 83.725,242 80,242C75.585,242 72,238.415 72,234C72,230.275 74.551,227.142 78,226.252L78,224L76,224C75.47,224 74.961,223.789 74.586,223.414C74.211,223.039 74,222.53 74,222C74,221.47 74.211,220.961 74.586,220.586C74.961,220.211 75.47,220 76,220C79.685,220 87.172,220 87.172,220C87.172,220 91.076,216.095 92.586,214.586C92.961,214.211 93.47,214 94,214L103.754,214ZM112,230C114.208,230 116,231.792 116,234C116,236.208 114.208,238 112,238C109.792,238 108,236.208 108,234C108,231.792 109.792,230 112,230ZM80,230C82.208,230 84,231.792 84,234C84,236.208 82.208,238 80,238C77.792,238 76,236.208 76,234C76,231.792 77.792,230 80,230ZM104.984,218L94.828,218C94.828,218 90.924,221.905 89.414,223.414C89.039,223.789 88.53,224 88,224L82,224L82,226.252C84.81,226.977 87.023,229.191 87.748,232L96.124,232C96.826,226.381 100.447,221.663 105.419,219.414L104.984,218Z" 
                              animate={{
                                fill: [
                                  "rgb(255, 255, 255)", 
                                  "rgb(206, 18, 18)", 
                                  "rgb(255, 255, 255)",
                                  "rgb(206, 18, 18)",
                                  "rgb(255, 255, 255)"
                                ]
                              }}
                              transition={{
                                duration: 3,
                                delay: 0.5,
                                ease: "linear",
                                times: [0, 0.25, 0.35, 0.45, 0.55]
                              }}
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="shaikh-text"
                  initial={{ opacity: 0, y: 10, letterSpacing: "1em" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <h2 className="font-headline text-4xl md:text-5xl font-black text-white tracking-widest text-center">
                    SHAIKH <span className="text-primary italic">&</span> SONS
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}