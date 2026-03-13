
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
      image: 'https://picsum.photos/seed/ev2/1920/1080',
      hint: 'electric luxury sedan teal',
      href: '/vehicles/v1',
    },
    {
      id: 'lumina',
      title: 'LUMINA',
      subtitle: 'INFINITE SUV',
      image: 'https://picsum.photos/seed/ev3/1920/1080',
      hint: 'electric luxury suv white',
      href: '/vehicles/v2',
    },
    {
      id: 'spectre',
      title: 'SPECTRE',
      subtitle: 'MASTER THE DARK',
      image: 'https://picsum.photos/seed/ev4/1920/1080',
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
          startIndex: 1, // Sets the middle slide (Lumina) as default
        }}
        className="w-full h-[75vh] md:h-[85vh]"
      >
        <CarouselContent className="-ml-0 h-full">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 h-full relative">
              <div className="relative w-full h-full min-h-[500px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint={slide.hint}
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4 max-w-4xl"
                  >
                    <p className="text-primary font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase">
                      {slide.subtitle}
                    </p>
                    <h2 className="font-headline text-5xl md:text-8xl font-black text-white tracking-tighter">
                      {slide.title}
                    </h2>
                    <div className="pt-10">
                      <Link href={slide.href}>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white hover:text-black rounded-full px-12 h-16 transition-all uppercase font-bold tracking-[0.2em] text-[10px]"
                        >
                          Explore Collection <ArrowRight className="ml-3 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-8 bg-black/40 border-white/10 text-white hover:bg-primary hover:text-white h-14 w-14 backdrop-blur-sm" />
          <CarouselNext className="right-8 bg-black/40 border-white/10 text-white hover:bg-primary hover:text-white h-14 w-14 backdrop-blur-sm" />
        </div>

        {/* Custom Progress Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20 pointer-events-none">
          {slides.map((_, i) => (
            <div key={i} className="h-[2px] w-8 rounded-full bg-white/20 overflow-hidden">
              {/* Note: This is a visual hint, real indicator logic would sync with Embla API */}
            </div>
          ))}
        </div>
      </Carousel>
    </section>
  );
}
