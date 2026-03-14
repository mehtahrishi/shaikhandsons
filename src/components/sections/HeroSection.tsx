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
      image: '/images/1.png',
      hint: 'electric luxury sedan teal',
    },
    {
      id: 'lumina',
      title: 'LUMINA',
      subtitle: 'INFINITE SUV',
      image: '/images/image.png',
      hint: 'electric luxury suv white',
    },
    {
      id: 'spectre',
      title: 'SPECTRE',
      subtitle: 'MASTER THE DARK',
      image: '/images/2.png',
      hint: 'electric sports car black',
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(1);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + slides.length) % slides.length;
  };

  return (
    <section className="relative w-full bg-black overflow-hidden pt-12 md:pt-24 pb-12 md:pb-24">
      <div className="container mx-auto px-0">
        <div className="relative w-full flex items-center justify-center">
          
          {/* Main Carousel Wrapper */}
          <div className="relative flex items-center justify-center w-full h-auto overflow-visible px-0">
            
            {/* Previous Peek (Left) */}
            <div 
              className="hidden md:block absolute left-0 w-[15%] aspect-[3/2] cursor-pointer overflow-hidden opacity-40 hover:opacity-60 transition-opacity z-0"
              onClick={prevSlide}
            >
              <div className="relative w-full h-full">
                <Image
                  src={slides[getSlideIndex(-1)].image}
                  alt="Previous"
                  fill
                  sizes="15vw"
                  className="object-cover"
                  data-ai-hint={slides[getSlideIndex(-1)].hint}
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </div>

            {/* Active Container (70% Width on Desktop) */}
            <div className="relative w-full md:w-[70%] aspect-[3/2] z-10 overflow-hidden shadow-2xl md:rounded-lg bg-black">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slides[currentIndex].id}
                  initial={{ opacity: 0, scale: 1.1, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={slides[currentIndex].image}
                    alt={slides[currentIndex].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    className="object-cover"
                    priority
                    data-ai-hint={slides[currentIndex].hint}
                  />
                  
                  {/* Cinematic Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-16 p-6 text-center z-20">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="space-y-1"
                    >
                      <p className="text-primary font-bold tracking-[0.4em] text-[8px] md:text-[10px] uppercase">
                        {slides[currentIndex].subtitle}
                      </p>
                      <h2 className="font-headline text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
                        {slides[currentIndex].title}
                      </h2>
                      <div className="mt-4 md:mt-8">
                        <button className="px-8 md:px-12 py-2 md:py-3 border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-full group">
                          Explore <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Peek (Right) */}
            <div 
              className="hidden md:block absolute right-0 w-[15%] aspect-[3/2] cursor-pointer overflow-hidden opacity-40 hover:opacity-60 transition-opacity z-0"
              onClick={nextSlide}
            >
              <div className="relative w-full h-full">
                <Image
                  src={slides[getSlideIndex(1)].image}
                  alt="Next"
                  fill
                  sizes="15vw"
                  className="object-cover"
                  data-ai-hint={slides[getSlideIndex(1)].hint}
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </div>

          </div>

          {/* Mobile Indicators */}
          <div className="absolute -bottom-8 flex justify-center gap-2 z-30 md:hidden">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1 transition-all duration-300 rounded-full",
                  currentIndex === idx ? "w-8 bg-primary" : "w-2 bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
