
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

export function InitialLoaderV2() {
  const [isLoading, setIsLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paths, setPaths] = useState<Record<string, string>>({});
  const [sparkleValues, setSparkleValues] = useState<{ x: number, y: number, w: number, h: number }[]>([]);

  useEffect(() => {
    setMounted(true);

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

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5500);

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
          key="loader-v2"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden text-foreground"
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="lightning-glow-v2">
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
                    filter="url(#lightning-glow-v2)"
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
                    filter="url(#lightning-glow-v2)"
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

          <div className="relative flex items-center justify-center scale-90 md:scale-100 min-w-[300px] h-[400px]">
            <AnimatePresence mode="wait">
              {!showText ? (
                <motion.div
                  key="bike-v2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className="relative flex items-center justify-center"
                >
                  {lightningBolts.map((bolt) => (
                    <div key={`sparkles-v2-${bolt.id}`} className="absolute inset-0 pointer-events-none">
                      {sparkleValues.map((sparkle, i) => (
                        <motion.div
                          key={`v2-${bolt.id}-sparkle-${i}`}
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
                    animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  <div className="z-10">
                    <svg width="120" height="120" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(-352,-326)">
                        <g transform="translate(18.8303,326)">
                          <g transform="translate(269.17,-192)">
                            <motion.path 
                              d="M103.754,214L102.523,210L98,210C96.896,210 96,209.104 96,208C96,209.104 96.896,210 98,210L104,210C104.878,210 105.653,210.573 105.912,211.412L107.939,218L112,218C113.104,218 114,218.896 114,220C114,221.104 113.104,222 112,222L109.169,222L111.634,230.008C111.755,230.003 111.877,230 112,230C116.415,230 120,233.585 120,238C120,242.415 116.415,246 112,246C107.585,246 104,242.415 104,238C104,235.12 105.525,232.594 107.811,231.185L106.609,227.278C102.69,229.254 100,233.315 100,238C100,238 100,238 100,238C100,239.105 99.105,240 98,240L87.748,240C86.858,243.449 83.725,246 80,246C75.585,246 72,242.415 72,238C72,234.275 74.551,231.142 78,230.252L78,228L76,228C75.47,228 74.961,227.789 74.586,227.414C74.211,227.039 74,226.53 74,226C74,225.47 74.211,224.961 74.586,224.586C74.961,224.211 75.47,224 76,224C79.685,224 87.172,224 87.172,224C87.172,224 91.076,220.095 92.586,218.586C92.961,218.211 93.47,218 94,218L103.754,218ZM112,234C114.208,234 116,235.792 116,238C116,240.208 114.208,242 112,242C109.792,242 108,240.208 108,238C108,235.792 109.792,234 112,234ZM80,234C82.208,234 84,235.792 84,238C84,240.208 82.208,242 80,242C77.792,242 76,240.208 76,238C76,235.792 77.792,234 80,234ZM104.984,222L94.828,222C94.828,222 90.924,225.905 89.414,227.414C89.039,227.789 88.53,228 88,228L82,228L82,230.252C84.81,230.977 87.023,233.191 87.748,236L96.124,236C96.826,230.381 100.447,225.663 105.419,223.414L104.984,222Z" 
                              initial={{ fill: "hsl(var(--foreground))" }}
                              animate={{ fill: ["hsl(var(--foreground))", "hsl(var(--primary))", "hsl(var(--foreground))"] }}
                              transition={{ duration: 2, delay: 0.5, ease: "linear", repeat: Infinity }}
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="v2-text"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <div className="w-[110px] md:w-[130px] h-[110px] md:h-[130px] border-[2px] md:border-[3px] border-primary rounded-full" />
                  </div>
                  <div className="z-10 flex flex-col items-center justify-center py-12 px-8">
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
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="mt-6 text-[10px] md:text-[12px] font-headline font-medium italic uppercase tracking-[0.3em] text-primary/90 text-center leading-relaxed"
                    >
                      Ride The Future With Our EV Scooters!
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
