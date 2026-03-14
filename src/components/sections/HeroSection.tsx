
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

  return (
    <section className="relative w-full bg-black overflow-hidden pt-12 md:pt-20 pb-12 md:pb-20">
      <div className="container mx-auto px-6 md:px-0 flex justify-center">
        {/* Carousel Wrapper - 70% width on Desktop, Full on Mobile */}
        <div className="relative w-full md:w-[70%] flex items-stretch justify-center aspect-[3/2] overflow-hidden shadow-2xl bg-black group/hero">
          
          {/* Left Side Strip Peek - Shows center of previous image */}
          <div 
            className="hidden md:flex w-[12%] cursor-pointer overflow-hidden relative z-30 transition-all duration-500 hover:w-[15%]"
            onMouseEnter={() => setSlide(getSlideIndex(-1))}
          >
            <div className="relative w-full h-full">
              <Image
                src={slides[getSlideIndex(-1)].image}
                alt="Previous"
                fill
                sizes="15vw"
                className="object-cover object-center grayscale brightness-50 contrast-125"
                data-ai-hint={slides[getSlideIndex(-1)].hint}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>
          </div>

          {/* Active Center Container (The "Window") */}
          <div className="relative flex-1 z-20 overflow-hidden bg-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[currentIndex].id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={slides[currentIndex].image}
                  alt={slides[currentIndex].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="object-contain"
                  priority
                  data-ai-hint={slides[currentIndex].hint}
                />
                
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 md:pb-16 p-4 text-center z-20">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-1"
                  >
                    <p className="text-primary font-bold tracking-[0.4em] text-[7px] md:text-[9px] uppercase">
                      {slides[currentIndex].subtitle}
                    </p>
                    <h2 className="font-headline text-xl sm:text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
                      {slides[currentIndex].title}
                    </h2>
                    <div className="mt-4 md:mt-8">
                      <button className="px-6 md:px-10 py-2 md:py-3 border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white text-[8px] md:text-[9px] font-bold uppercase tracking-widest transition-all rounded-full group">
                        Explore <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side Strip Peek - Shows center of next image */}
          <div 
            className="hidden md:flex w-[12%] cursor-pointer overflow-hidden relative z-30 transition-all duration-500 hover:w-[15%]"
            onMouseEnter={() => setSlide(getSlideIndex(1))}
          >
            <div className="relative w-full h-full">
              <Image
                src={slides[getSlideIndex(1)].image}
                alt="Next"
                fill
                sizes="15vw"
                className="object-cover object-center grayscale brightness-50 contrast-125"
                data-ai-hint={slides[getSlideIndex(1)].hint}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>
          </div>

        </div>

        {/* Mobile Indicators */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-0.5 transition-all duration-300 rounded-full",
                currentIndex === idx ? "w-8 bg-primary" : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
