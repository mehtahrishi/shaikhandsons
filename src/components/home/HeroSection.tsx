
"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function HeroSection() {
  // Carousel slides using real images from public/carousel
  const slides = [
    {
      id: 'atum',
      title: 'ATUM',
      subtitle: 'ADVANCED MOBILITY',
      image: '/carousel/atun.png',
      hint: 'atum vehicle',
    },
    {
      id: 'dynamo',
      title: 'DYNAMO',
      subtitle: 'DYNAMIC PERFORMANCE',
      image: '/carousel/dynamo.png',
      hint: 'dynamo vehicle',
    },
    {
      id: 'evey',
      title: 'EVEY',
      subtitle: 'ELECTRIC EVOLUTION',
      image: '/carousel/evey.png',
      hint: 'evey vehicle',
    },
    {
      id: 'worzo',
      title: 'WORZO',
      subtitle: 'FUTURE READY',
      image: '/carousel/worzo.png',
      hint: 'worzo vehicle',
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(1);

  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + slides.length) % slides.length;
  };

  const setSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => setSlide(getSlideIndex(1));

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full bg-black overflow-hidden pb-0">
      <div className="w-full">
        {/* Desktop & Tablet View: Interactive Window Slide (50% center) */}
        <div className="hidden md:flex w-full items-stretch justify-center bg-black group/hero">

          {/* Left Peek Strip (25%) */}
          <div
            className="w-[25%] cursor-pointer overflow-hidden relative z-30 transition-all duration-300 hover:brightness-110"
            onMouseEnter={() => setSlide(getSlideIndex(-1))}
          >
            <div className="relative w-full h-full aspect-[3/2] md:aspect-auto">
              <Image
                src={slides[getSlideIndex(-1)].image}
                alt="Previous"
                fill
                sizes="25vw"
                className="object-cover object-center grayscale brightness-50 contrast-125"
                data-ai-hint={slides[getSlideIndex(-1)].hint}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>
          </div>

          {/* Active Center Pane (50%) */}
          <div className="relative w-[50%] aspect-[3/2] z-20 overflow-hidden bg-black border-x border-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[currentIndex].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "linear" }}
                className="relative w-full h-full"
              >
                <Image
                  src={slides[currentIndex].image}
                  alt={slides[currentIndex].title}
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority
                  data-ai-hint={slides[currentIndex].hint}
                />

                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 p-4 text-center z-20">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="space-y-1"
                  >
                    <p className="text-primary font-bold tracking-[0.4em] text-[9px] uppercase">
                      {slides[currentIndex].subtitle}
                    </p>
                    <h2 className="font-headline text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">
                      {slides[currentIndex].title}
                    </h2>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Peek Strip (25%) */}
          <div
            className="w-[25%] cursor-pointer overflow-hidden relative z-30 transition-all duration-300 hover:brightness-110"
            onMouseEnter={() => setSlide(getSlideIndex(1))}
          >
            <div className="relative w-full h-full aspect-[3/2] md:aspect-auto">
              <Image
                src={slides[getSlideIndex(1)].image}
                alt="Next"
                fill
                sizes="25vw"
                className="object-cover object-center grayscale brightness-50 contrast-125"
                data-ai-hint={slides[getSlideIndex(1)].hint}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>
          </div>
        </div>

        {/* Mobile View: Normal Carousel with Buttons - Full Width */}
        <div className="flex md:hidden flex-col items-center w-full px-0">
          <div className="relative w-full aspect-[3/2] overflow-hidden group/mobile">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[currentIndex].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={slides[currentIndex].image}
                  alt={slides[currentIndex].title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                  data-ai-hint={slides[currentIndex].hint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Mobile Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 p-6 text-center">
                  <p className="text-primary font-bold tracking-[0.3em] text-[8px] uppercase mb-1">
                    {slides[currentIndex].subtitle}
                  </p>
                  <h2 className="font-headline text-2xl font-black text-white tracking-tighter uppercase">
                    {slides[currentIndex].title}
                  </h2>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Indicators (Dots) - Now INSIDE and ABSOLUTE */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-30">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlide(idx)}
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    currentIndex === idx ? "w-8 h-1 bg-primary" : "w-1.5 h-1.5 bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
