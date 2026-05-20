"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrownIcon } from '@/components/common/BrandIdentity';



export function InitialLoader() {
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Total cinematic sequence duration
    const timer = setTimeout(() => setIsComplete(true), 4000);
    return () => clearTimeout(timer);
  }, []);

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
              className="absolute z-30 flex flex-col items-center px-4 w-full"
            >
              <h1 className="font-headline text-2xl sm:text-3xl md:text-5xl font-black tracking-[0.2em] sm:tracking-[0.4em] text-foreground whitespace-nowrap flex items-center">
                SHAIKH
                <span className="relative inline-flex items-center justify-center mx-2 sm:mx-4">
                  <span className="text-primary italic font-bold">&</span>
                  <span className="absolute -top-2.5 sm:-top-3 md:-top-4 -left-0.5 sm:-left-1 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 -rotate-[15deg] text-primary">
                    <CrownIcon />
                  </span>
                </span>
                SONS
              </h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 1] }}
                transition={{ duration: 4.0, times: [0, 0.6, 0.7, 1] }}
                className="mt-4 flex items-center gap-2 sm:gap-4"
              >
                <div className="h-[1px] w-4 sm:w-8 bg-primary/50" />
                <p className="text-[7px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.6em] text-primary/80 uppercase font-code">
                  Electric Performance
                </p>
                <div className="h-[1px] w-4 sm:w-8 bg-primary/50" />
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
              className="absolute w-[280px] sm:w-[400px] h-[150px] sm:h-[200px] bg-primary/30 rounded-[100%] blur-[60px] sm:blur-[80px] z-0 pointer-events-none"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}