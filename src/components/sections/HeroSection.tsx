
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
    <section className="relative w-full bg-black overflow-hidden pt-[64px]">
      <div className="container mx-auto px-0 md:px-6">
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0 relative group bg-black">
                {/* 3:2 Aspect Ratio Container to prevent CLS and ensure zero cropping */}
                <div className="relative w-full aspect-[3/2] overflow-hidden bg-black">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1536px"
                    className="object-contain transition-all duration-1000 ease-in-out"
                    priority
                    data-ai-hint={slide.hint}
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-16 p-6 text-center z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="space-y-1.5 max-w-4xl"
                    >
                      <p className="text-primary font-bold tracking-[0.4em] text-[9px] md:text-xs uppercase">
                        {slide.subtitle}
                      </p>
                      <h2 className="font-headline text-2xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter">
                        {slide.title}
                      </h2>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
