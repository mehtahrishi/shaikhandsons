"use client"

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from '@/components/ui/carousel';

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

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <section className="relative w-full bg-black overflow-hidden pt-[72px]">
      <Carousel 
        opts={{
          align: "start",
          loop: true,
          startIndex: 1, // Sets the middle slide (Lumina) as default
        }}
        plugins={[plugin.current]}
        className="w-full h-[60vh] sm:h-[70vh] md:h-[85vh]"
      >
        <CarouselContent className="-ml-0 h-full">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 h-full relative group">
              <div className="relative w-full h-full min-h-[300px] sm:min-h-[450px] md:min-h-[600px] overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover grayscale transition-all duration-1000 ease-in-out group-hover:grayscale-0"
                  priority
                  data-ai-hint={slide.hint}
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                
                {/* Content - Responsive positioning */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 md:pb-20 p-6 sm:p-8 text-center z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-2 max-w-4xl"
                  >
                    <p className="text-primary font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase">
                      {slide.subtitle}
                    </p>
                    <h2 className="font-headline text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter">
                      {slide.title}
                    </h2>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Custom Progress Indicators */}
        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex justify-center gap-3 z-20 pointer-events-none">
          {slides.map((_, i) => (
            <div key={i} className="h-[2px] w-8 sm:w-12 rounded-full bg-white/20 overflow-hidden relative" />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
