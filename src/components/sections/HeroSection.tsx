
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  const [currentIndex, setCurrentIndex] = useState(1); // Start with Lumina in center

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full bg-black overflow-hidden pt-[64px] md:pt-[80px] pb-12 md:pb-24">
      <div className="container mx-auto px-0 md:px-6">
        <div className="relative w-full md:max-w-[70%] mx-auto">
          {/* Main 3:2 Aspect Container */}
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-none md:rounded-2xl bg-black group">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[currentIndex].id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="relative w-full h-full"
              >
                <Image
                  src={slides[currentIndex].image}
                  alt={slides[currentIndex].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="object-contain md:object-cover"
                  priority
                  data-ai-hint={slides[currentIndex].hint}
                />
                
                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-16 p-6 text-center z-10">
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
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Desktop Navigation "Peek" Zones */}
            <div className="hidden md:block">
              {/* Left Peek/Trigger */}
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-0 bottom-0 w-1/6 z-20 group/peek flex items-center justify-start pl-4"
                aria-label="Previous Vehicle"
              >
                <div className="opacity-0 group-hover/peek:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover/peek:translate-x-0 bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10">
                  <ChevronLeft className="h-6 w-6 text-white" />
                </div>
              </button>

              {/* Right Peek/Trigger */}
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-0 bottom-0 w-1/6 z-20 group/peek flex items-center justify-end pr-4"
                aria-label="Next Vehicle"
              >
                <div className="opacity-0 group-hover/peek:opacity-100 transition-all duration-500 translate-x-[10px] group-hover/peek:translate-x-0 bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10">
                  <ChevronRight className="h-6 w-6 text-white" />
                </div>
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30 md:hidden">
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
      </div>
    </section>
  );
}
