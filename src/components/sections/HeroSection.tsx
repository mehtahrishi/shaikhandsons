
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroSection() {
  const slides = [
    {
      id: 'aether',
      title: 'AETHER',
      subtitle: 'TRANSCENDENTAL SEDAN',
      image: 'https://picsum.photos/seed/ev2/1536/1024',
      hint: 'luxury electric sedan teal',
    },
    {
      id: 'lumina',
      title: 'LUMINA',
      subtitle: 'INFINITE SUV',
      image: 'https://picsum.photos/seed/ev3/1536/1024',
      hint: 'luxury electric suv white',
    },
    {
      id: 'spectre',
      title: 'SPECTRE',
      subtitle: 'MASTER THE DARK',
      image: 'https://picsum.photos/seed/ev4/1536/1024',
      hint: 'luxury electric sports car black',
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
  const prevSlide = () => setSlide(getSlideIndex(-1));

  return (
    <section className="relative w-full bg-black overflow-hidden pt-20 md:pt-24 pb-0">
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
                    <div className="mt-8">
                      <button className="px-10 py-3 border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest transition-all rounded-full group">
                        Explore <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </div>
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
          <div className="relative w-full aspect-[3/2] overflow-hidden group/mobile shadow-2xl">
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
                  <h2 className="font-headline text-2xl font-black text-white tracking-tighter uppercase mb-6">
                    {slides[currentIndex].title}
                  </h2>
                  <button className="px-8 py-3 bg-primary text-primary-foreground text-[8px] font-bold uppercase tracking-widest rounded-full">
                    Configure
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Nav Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Indicators (Dots) */}
          <div className="flex justify-center gap-3 mt-8 mb-12">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlide(idx)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  currentIndex === idx ? "w-8 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
