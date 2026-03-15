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

export function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paths, setPaths] = useState<Record<string, string>>({});
  const [sparkleValues, setSparkleValues] = useState<{ x: number, y: number, w: number, h: number }[]>([]);

  useEffect(() => {
    setMounted(true);

    // Generate paths on client only to avoid hydration mismatch
    const generatePath = (startX: number, startY: number, endX: number, endY: number, segments: number = 8, jitter: number = 30) => {
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

    setPaths({
      tlCore: generatePath(0, 0, 50, 50),
      tlGlow: generatePath(0, 0, 50, 50, 10, 40),
      brCore: generatePath(100, 100, 50, 50),
      brGlow: generatePath(100, 100, 50, 50, 10, 40)
    });

    const sparkles = Array.from({ length: 12 }).map(() => ({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      w: Math.random() * 4 + 2,
      h: Math.random() * 4 + 2,
    }));
    setSparkleValues(sparkles);

    // Phase 1: Total duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5500);

    // Phase 2: Transition from Icon to Text
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
    };
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-[100] bg-background" />;
  }

  const lightningBolts = [
    { id: 'tl', delay: 0.5 },
    { id: 'br', delay: 1.2 },
  ];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden text-foreground"
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
                {paths[`${bolt.id}Core`] && (
                  <motion.path
                    d={paths[`${bolt.id}Core`]}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    filter="url(#lightning-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: [0, 1],
                      opacity: [0, 1, 0, 1, 0],
                    }}
                    transition={{ 
                      duration: 0.4, 
                      delay: bolt.delay,
                      times: [0, 0.2, 0.4, 0.6, 1]
                    }}
                  />
                )}
                {paths[`${bolt.id}Glow`] && (
                  <motion.path
                    d={paths[`${bolt.id}Glow`]}
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
                      duration: 0.4, 
                      delay: bolt.delay + 0.05
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </svg>

          {/* Central Content Area */}
          <div className="relative flex items-center justify-center scale-90 md:scale-100 min-w-[300px] h-[400px]">
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
                  {/* Impact Sparkles */}
                  {lightningBolts.map((bolt) => (
                    <div key={`sparkles-${bolt.id}`} className="absolute inset-0 pointer-events-none">
                      {sparkleValues.map((sparkle, i) => (
                        <motion.div
                          key={`${bolt.id}-sparkle-${i}`}
                          className="absolute bg-foreground rounded-full shadow-[0_0_10px_currentColor]"
                          style={{
                            width: sparkle.w,
                            height: sparkle.h,
                            left: '50%',
                            top: '50%',
                          }}
                          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                          animate={{
                            x: [0, sparkle.x],
                            y: [0, sparkle.y],
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0.2],
                          }}
                          transition={{
                            duration: 0.6,
                            delay: bolt.delay + 0.1,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  ))}

                  <motion.div 
                    className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  <div className="z-10">
                    <svg 
                      width="120" 
                      height="120" 
                      viewBox="0 0 64 64" 
                      className="drop-shadow-[0_0_10px_rgba(var(--foreground),0.3)]"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(-352,-326)">
                        <g transform="translate(18.8303,326)">
                          <g transform="translate(269.17,-192)">
                            <motion.path 
                              d="M103.754,214L102.523,210L98,210C96.896,210 96,209.104 96,208C96,206.896 96.896,206 98,206L104,206C104.878,206 105.653,206.573 105.912,207.412L107.939,214L112,214C113.104,214 114,214.896 114,216C114,217.104 113.104,218 112,218L109.169,218L111.634,226.008C111.755,226.003 111.877,226 112,226C116.415,226 120,229.585 120,234C120,238.415 116.415,242 112,242C107.585,242 104,238.415 104,234C104,231.12 105.525,228.594 107.811,227.185L106.609,223.278C102.69,225.254 100,229.315 100,234C100,234 100,234 100,234C100,235.105 99.105,236 98,236L87.748,236C86.858,239.449 83.725,242 80,242C75.585,242 72,238.415 72,234C72,230.275 74.551,227.142 78,226.252L78,224L76,224C75.47,224 74.961,223.789 74.586,223.414C74.211,223.039 74,222.53 74,222C74,221.47 74.211,220.961 74.586,220.586C74.961,220.211 75.47,220 76,220C79.685,220 87.172,220 87.172,220C87.172,220 91.076,216.095 92.586,214.586C92.961,214.211 93.47,214 94,214L103.754,214ZM112,230C114.208,230 116,231.792 116,234C116,236.208 114.208,238 112,238C109.792,238 108,236.208 108,234C108,231.792 109.792,230 112,230ZM80,230C82.208,230 84,231.792 84,234C84,236.208 82.208,238 80,238C77.792,238 76,236.208 76,234C76,231.792 77.792,230 80,230ZM104.984,218L94.828,218C94.828,218 90.924,221.905 89.414,223.414C89.039,223.789 88.53,224 88,224L82,224L82,226.252C84.81,226.977 87.023,229.191 87.748,232L96.124,232C96.826,226.381 100.447,221.663 105.419,219.414L104.984,218Z" 
                              initial={{ fill: "hsl(var(--foreground))" }}
                              animate={{
                                fill: [
                                  "hsl(var(--foreground))", 
                                  "hsl(var(--primary))", 
                                  "hsl(var(--foreground))",
                                  "hsl(var(--primary))",
                                  "hsl(var(--foreground))"
                                ]
                              }}
                              transition={{
                                duration: 2,
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
                  key="shaikh-text-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center justify-center"
                >
                  <motion.div
                    key="shaikh-text"
                    initial={{ opacity: 0, y: 10, letterSpacing: "1em" }}
                    animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center relative"
                  >
                    {/* Circular Frame for Branding */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                        className="w-[110px] md:w-[130px] h-[110px] md:h-[130px] border-[2px] md:border-[3px] border-primary rounded-full z-0 flex items-center justify-center relative"
                      >
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 0.2, scale: 1.2 }}
                          transition={{ delay: 0.5, duration: 1.2 }}
                          className="absolute inset-0 bg-primary/20 rounded-full blur-2xl z-0"
                        />
                      </motion.div>
                    </div>

                    <div className="z-10 flex flex-col items-center justify-center py-12 px-8 md:px-16">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mb-4"
                      />
                      <h2 className="font-headline text-xl md:text-3xl font-black text-foreground tracking-widest text-center whitespace-nowrap flex items-center gap-2">
                        <span>SHAIKH</span>
                        <span className="relative inline-flex items-center justify-center mx-1">
                          <span className="text-primary italic font-bold">&</span>
                          <span className="absolute -top-3 md:-top-4 -left-1 w-4 h-4 md:w-5 md:h-5 -rotate-[15deg] text-primary">
                            <CrownIcon />
                          </span>
                        </span>
                        <span>SONS</span>
                      </h2>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mt-4"
                      />
                      
                      {/* Responsive Slogan */}
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="mt-6 text-[10px] md:text-[12px] font-headline font-medium italic uppercase tracking-[0.3em] text-primary/90 text-center max-w-[280px] md:max-w-none leading-relaxed"
                      >
                        Ride The Future With Our EV Scooters!
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
