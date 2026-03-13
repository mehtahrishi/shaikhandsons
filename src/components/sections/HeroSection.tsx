
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  // Middle index (1) is selected by default
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(1);

  const panels = [
    {
      id: 'aether',
      title: 'AETHER',
      subtitle: 'TRANSCENDENTAL SEDAN',
      image: '/images/1.png',
      hint: 'electric sedan teal',
      href: '/vehicles/v1',
      objectPosition: 'left center'
    },
    {
      id: 'lumina',
      title: 'LUMINA',
      subtitle: 'INFINITE SUV',
      image: '/images/image.png',
      hint: 'electric suv white',
      href: '/vehicles/v2',
      objectPosition: 'center'
    },
    {
      id: 'spectre',
      title: 'SPECTRE',
      subtitle: 'MASTER THE DARK',
      image: '/images/2.png',
      hint: 'electric sports car black',
      href: '/vehicles/v3',
      objectPosition: 'right center'
    }
  ];

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-black overflow-hidden pt-20">
      {/* Desktop Layout: Reveal Accordion */}
      <div className="hidden md:flex h-full w-full">
        {panels.map((panel, index) => {
          const isHovered = hoveredIndex === index;
          const isAnyHovered = hoveredIndex !== null;
          
          let flexValue = 1;
          if (isAnyHovered) {
            flexValue = isHovered ? 2.5 : 0.75;
          } else {
            flexValue = index === 1 ? 1.2 : 1;
          }

          return (
            <motion.div
              key={panel.id}
              className="relative h-full overflow-hidden cursor-pointer group border-r border-white/5 last:border-r-0"
              initial={false}
              animate={{ 
                flex: flexValue,
              }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(1)}
            >
              {/* 
                THE SLIDING VIEWPORT:
                The container below is ALWAYS 100vw wide. 
                Because its width never changes, the image inside NEVER zooms or scales.
                The parent motion.div (the panel) simply masks it.
              */}
              <div className="absolute inset-0 w-[100vw] h-full left-1/2 -translate-x-1/2 pointer-events-none">
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  animate={{
                    opacity: isHovered ? 1 : 0.4,
                    filter: isHovered ? 'grayscale(0)' : 'grayscale(0.5)',
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src={panel.image}
                    alt={panel.title}
                    fill
                    className="object-cover"
                    style={{ 
                      objectPosition: panel.objectPosition,
                      transition: 'none' 
                    }}
                    sizes="100vw"
                    priority
                    data-ai-hint={panel.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                </motion.div>
              </div>

              {/* Panel Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                <div className="pointer-events-none">
                  <p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-2 uppercase">
                    {panel.subtitle}
                  </p>
                  <h2 className="font-headline text-5xl lg:text-7xl font-black text-white tracking-tighter">
                    {panel.title}
                  </h2>
                </div>

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="mt-8"
                    >
                      <Link href={panel.href}>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black rounded-full px-8 h-12 transition-all"
                        >
                          Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Layout: Snap Carousel */}
      <div className="flex md:hidden h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-black">
        {panels.map((panel) => (
          <div 
            key={panel.id} 
            className="flex-shrink-0 w-full h-full snap-center relative"
          >
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              className="object-cover"
              style={{ objectPosition: 'center' }}
              data-ai-hint={panel.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            
            <div className="absolute inset-x-0 bottom-0 p-12 flex flex-col items-center text-center">
              <p className="text-primary font-bold tracking-[0.3em] text-[10px] mb-2 uppercase">
                {panel.subtitle}
              </p>
              <h2 className="font-headline text-5xl font-black text-white tracking-tighter mb-8">
                {panel.title}
              </h2>
              <Link href={panel.href} className="w-full max-w-xs">
                <Button className="w-full bg-primary text-white rounded-full h-14 font-bold uppercase tracking-widest text-sm">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
