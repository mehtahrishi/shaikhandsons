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

const HexCell = ({ delay = 0, active = false }: { delay?: number, active?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: active ? 1 : [0.1, 0.3, 0.1], 
      scale: active ? 1.05 : 1,
      color: active ? "hsl(var(--primary))" : "currentColor"
    }}
    transition={{ duration: 0.5, delay, repeat: active ? 0 : Infinity }}
    className="w-8 h-9 relative"
    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", border: "1px solid currentColor" }}
  >
    <div className={`absolute inset-0 bg-current transition-opacity duration-300 ${active ? 'opacity-20' : 'opacity-5'}`} />
  </motion.div>
);

export function InitialLoaderElectric() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [voltage, setVoltage] = useState(71.2);
  const [mode, setMode] = useState('ECO');
  const [bootPhase, setBootPhase] = useState(0); // 0: Init, 1: Check, 2: Reveal

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setBootPhase(2), 500);
          return 100;
        }
        return prev + Math.random() * 8;
      });
      setVoltage(v => (v + (Math.random() - 0.5) * 0.2));
    }, 150);

    const modeTimer = setInterval(() => {
      setMode(m => m === 'ECO' ? 'RIDE' : m === 'RIDE' ? 'SPORT' : 'ECO');
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(modeTimer);
    };
  }, []);

  useEffect(() => {
    if (bootPhase === 2) {
      const exitTimer = setTimeout(() => setIsComplete(true), 3000);
      return () => clearTimeout(exitTimer);
    }
  }, [bootPhase]);

  if (isComplete) return null;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-code text-white selection:bg-primary/30"
        >
          {/* Subtle Scanlines Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
            style={{ backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))", backgroundSize: "100% 4px, 3px 100%" }} 
          />

          <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center border-x border-white/5 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
            
            {/* CORNER DATA: TOP LEFT (VOLTAGE) */}
            <div className="absolute top-8 left-8 flex flex-col gap-1">
              <span className="text-[10px] text-primary font-bold opacity-50 tracking-widest">BATT VOLTAGE</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-primary">{voltage.toFixed(1)}</span>
                <span className="text-[10px] opacity-40">V</span>
              </div>
            </div>

            {/* CORNER DATA: TOP RIGHT (TEMP) */}
            <div className="absolute top-8 right-8 flex flex-col items-end gap-1">
              <span className="text-[10px] text-primary font-bold opacity-50 tracking-widest">CORE TEMP</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-primary">28</span>
                <span className="text-[10px] opacity-40">°C</span>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
              </div>
            </div>

            {/* CORNER DATA: BOTTOM LEFT (CONNECTIVITY) */}
            <div className="absolute bottom-8 left-8 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] text-primary font-bold opacity-50 tracking-widest">CONNECTIVITY</span>
                 <div className="flex gap-2">
                    <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-primary">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.71,7.71L12,2h-1v7.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L11,14.41V22h1l5.71-5.71L13.41,12L17.71,7.71z M13,5.83 l1.88,1.88L13,9.59V5.83z M13,18.17v-3.76l1.88,1.88L13,18.17z"/></svg>
                    </motion.div>
                    <span className="text-[10px] font-bold tracking-tighter">BT_LINK: CONNECTED</span>
                 </div>
              </div>
            </div>

            {/* CORNER DATA: BOTTOM RIGHT (DRIVE MODE) */}
            <div className="absolute bottom-8 right-8 flex flex-col items-end gap-1">
              <span className="text-[10px] text-primary font-bold opacity-50 tracking-widest">DRIVE MODE</span>
              <div className="flex gap-2 text-[10px] font-black">
                <span className={mode === 'ECO' ? 'text-primary' : 'opacity-20'}>ECO</span>
                <span className={mode === 'RIDE' ? 'text-primary' : 'opacity-20'}>RIDE</span>
                <span className={mode === 'SPORT' ? 'text-primary' : 'opacity-20'}>SPORT</span>
              </div>
            </div>

            {/* CENTRAL INTERFACE */}
            <AnimatePresence mode="wait">
              {bootPhase < 2 ? (
                <motion.div
                  key="boot-ui"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                  className="relative flex flex-col items-center"
                >
                  {/* Hexagon Protection Grid */}
                  <div className="grid grid-cols-5 gap-2 mb-8 opacity-40">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <HexCell key={i} delay={i * 0.05} active={progress > (i / 15) * 100} />
                    ))}
                  </div>

                  {/* Main Gauge */}
                  <div className="relative flex items-center justify-center">
                    <svg width="220" height="220" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="0.5" fill="none" className="opacity-10" />
                      <motion.circle 
                        cx="50" cy="50" r="45" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth="2" 
                        fill="none"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                        strokeLinecap="round"
                        style={{ filter: "drop-shadow(0 0 10px hsl(var(--primary)))" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                       <motion.span className="text-5xl font-black tracking-tighter">
                          {Math.round(progress)}
                       </motion.span>
                       <span className="text-[10px] tracking-[0.4em] opacity-40 font-bold">READY TO IGNITE</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reveal-ui"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                   <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 300 }}
                      className="h-[1px] bg-primary mb-6"
                    />
                    
                    <h1 className="font-headline text-4xl md:text-6xl font-black tracking-[0.2em] flex items-center gap-4 text-white">
                        <span>SHAIKH</span>
                        <span className="relative flex items-center justify-center">
                          <span className="text-primary italic font-bold">&</span>
                          <motion.span 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: -35, opacity: 1 }}
                            className="absolute scale-[0.6] text-primary"
                          >
                            <CrownIcon />
                          </motion.span>
                        </span>
                        <span>SONS</span>
                    </h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 text-[10px] tracking-[0.8em] text-primary uppercase font-bold"
                    >
                      Electronic Performance
                    </motion.p>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 300 }}
                      transition={{ delay: 0.3 }}
                      className="h-[1px] bg-primary mt-8"
                    />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
          
          {/* Dashboard Glow Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
