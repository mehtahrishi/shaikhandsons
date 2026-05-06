"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CrownIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full">
    <g>
      <path d="M124.536,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S111.66,178.991,124.536,178.991z"/>
      <path d="M46.66,211.508c0-12.883-10.454-23.321-23.33-23.321C10.454,188.187,0,198.625,0,211.508 c0,12.884,10.454,23.322,23.33,23.322C36.206,234.83,46.66,224.392,46.66,211.508z"/>
      <path d="M387.464,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S374.588,178.991,387.464,178.991z"/>
      <path d="M488.686,188.187c-12.892,0-23.33,10.438-23.33,23.321c0,12.884,10.454,23.322,23.33,23.322 c12.876,0,23.314-10.438,23.314-23.322C512,198.625,501.562,188.187,488.686,188.187z"/>
      <rect x="80.101" y="399.236" width="351.815" height="36.296"/>
      <path d="M400.193,272.999c-33.932-23.322-14.839-82.694-14.839-82.694l-19.388-5.661 c-40.721,77.385-100.608,73.761-95.937-12.728v-27.715h33.686v-28.05h-33.686V76.468h-28.058v39.682h-33.702v28.05h33.702v27.715 c4.679,86.49-55.2,90.113-95.938,12.728l-19.371,5.661c0,0,19.076,59.372-14.839,82.694 c-33.932,23.321-63.626-33.923-63.626-33.923l-19.076,8.474L82.13,374.777H429.87l53.008-127.226l-19.076-8.474 C463.802,239.076,434.125,296.32,400.193,272.999z M170.852,321.058c-9.26,0-16.77-7.501-16.77-16.762 c0-9.252,7.51-16.753,16.77-16.753c9.244,0,16.753,7.501,16.753,16.753C187.606,313.557,180.096,321.058,170.852,321.058z M256.008,312.681c-9.26,0-16.762-7.501-16.762-16.762c0-9.252,7.501-16.753,16.762-16.753c9.252,0,16.753,7.501,16.753,16.753 C272.762,305.18,256.008,312.681,256.008,312.681z M341.164,321.058c-9.26,0-16.753-7.501-16.753-16.762 c0-9.252,7.493-16.753,16.753-16.753c9.26,0,16.753,7.501,16.753,16.753C357.918,313.557,350.425,321.058,341.164,321.058z"/>
    </g>
  </svg>
);

export function InitialLoaderEV() {
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Total cinematic sequence duration
    const timer = setTimeout(() => setIsComplete(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Phase 1: Vertical Battery Charge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1, 1, 1.5],
              }}
              transition={{ duration: 2.0, times: [0, 0.1, 0.7, 1], ease: "easeInOut" }}
              className="absolute flex flex-col items-center"
            >
              <div className="w-12 h-24 border-2 border-primary rounded-md p-1 relative">
                {/* Battery Cap */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-primary rounded-t-sm" />
                
                {/* Fill Animation */}
                <div className="w-full h-full flex flex-col justify-end">
                  <motion.div
                    initial={{ height: "0%" }}
                    animate={{ height: ["0%", "100%"] }}
                    transition={{ duration: 1.4, times: [0, 1], ease: "linear" }}
                    className="w-full bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)]"
                  />
                </div>
              </div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.8, times: [0.1, 0.5, 0.9] }}
                className="mt-4 font-code text-[10px] tracking-[0.3em] text-primary font-bold"
              >
                POWERING UP
              </motion.span>
            </motion.div>

            {/* Phase 2: Energy Shockwave */}
            <motion.div
              initial={{ opacity: 0, scale: 0, border: "2px solid hsl(var(--primary))" }}
              animate={{ 
                opacity: [0, 0, 1, 0],
                scale: [0, 0, 4, 8],
              }}
              transition={{ duration: 2.5, times: [0, 0.5, 0.7, 1], ease: "easeOut" }}
              className="absolute w-40 h-40 rounded-full z-10 pointer-events-none"
              style={{ boxShadow: "0 0 50px rgba(var(--primary-rgb), 0.5)" }}
            />

            {/* Phase 3: Pristine Brand Reveal */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
              animate={{ 
                opacity: [0, 0, 1, 1], 
                filter: ["blur(20px)", "blur(20px)", "blur(0px)", "blur(0px)"],
                scale: [0.9, 0.9, 1, 1.02]
              }}
              transition={{ duration: 4.0, times: [0, 0.5, 0.75, 1], ease: "easeOut" }}
              className="absolute z-30 flex flex-col items-center"
            >
              <h1 className="font-headline text-3xl md:text-5xl font-black tracking-[0.4em] text-foreground whitespace-nowrap ml-[0.4em]">
                SHAIKH
                <span className="relative inline-flex items-center justify-center mx-4">
                  <span className="text-primary italic font-bold">&</span>
                  <span className="absolute -top-3 md:-top-4 -left-1 w-4 h-4 md:w-6 md:h-6 -rotate-[15deg] text-primary">
                    <CrownIcon />
                  </span>
                </span>
                SONS
              </h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 1] }}
                transition={{ duration: 4.0, times: [0, 0.6, 0.7, 1] }}
                className="mt-4 flex items-center gap-4"
              >
                <div className="h-[1px] w-8 bg-primary/50" />
                <p className="text-[9px] tracking-[0.6em] text-primary/80 uppercase font-code">
                  Electric Performance
                </p>
                <div className="h-[1px] w-8 bg-primary/50" />
              </motion.div>
            </motion.div>

            {/* Subdued Energy Flare */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0, 0.15, 0],
                scale: [0, 0, 1.5, 2]
              }}
              transition={{ duration: 3.0, times: [0, 0.5, 0.6, 1], ease: "easeOut" }}
              className="absolute w-[400px] h-[200px] bg-primary/30 rounded-[100%] blur-[80px] z-0 pointer-events-none"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}