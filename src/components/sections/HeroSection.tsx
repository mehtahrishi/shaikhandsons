
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const slides = [
    {
      id: 'aether',
      title: 'AETHER',
      subtitle: 'TRANSCENDENTAL SEDAN',
      image: '/images/1.png',
      hint: 'electric luxury sedan teal',
      href: '/vehicles/v1',
    },
    {
      id: 'lumina',
      title: 'LUMINA',
      subtitle: 'INFINITE SUV',
      image: '/images/image.png',
      hint: 'electric luxury suv white',
      href: '/vehicles/v2',
    },
    {
      id: 'spectre',
      title: 'SPECTRE',
      subtitle: 'MASTER THE DARK',
      image: '/images/2.png',
      hint: 'electric sports car black',
      href: '/vehicles/v3',
    }
  ];

  return (
    <section className="relative w-full bg-black overflow-hidden pt-[72px]">
      <Carousel 
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full h-[70vh] md:h-[85vh] min-h-[500px]"
      >
        <CarouselContent className="-ml-0 h-full">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 h-full relative">
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint={slide.hint}
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                  >
                    <p className="text-primary font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase">
                      {slide.subtitle}
                    </p>
                    <h2 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter">
                      {slide.title}
                    </h2>
                    <div className="pt-8">
                      <Link href={slide.href}>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black rounded-full px-10 h-14 transition-all uppercase font-bold tracking-widest text-xs"
                        >
                          Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation - Hidden on very small screens, shown on md+ */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-8 bg-black/20 border-white/10 text-white hover:bg-primary hover:text-white h-12 w-12" />
          <CarouselNext className="right-8 bg-black/20 border-white/10 text-white hover:bg-primary hover:text-white h-12 w-12" />
        </div>

        {/* Mobile Navigation Hint */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center md:hidden">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <div key={i} className="h-1 w-6 rounded-full bg-white/20" />
            ))}
          </div>
        </div>
      </Carousel>
    </section>
  );
}
