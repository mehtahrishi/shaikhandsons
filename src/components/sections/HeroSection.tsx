
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  // Middle index (1) is now selected by default
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
    <section className="relative h-[85vh] min-h-[600px] w-full bg-black overflow-hidden pt-[64px] md:pt-[72px]">
      {/* Desktop Layout: Hover Accordion */}
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
              className="relative h-full overflow-hidden cursor-pointer group"
              initial={false}
              animate={{ 
                flex: flexValue,
                transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(1)} // Reset to middle on leave
            >
              {/* Image Container */}
              <motion.div 
                className="absolute inset-0 w-full h-full"
                animate={{
                  filter: isHovered ? 'grayscale(0)' : 'grayscale(1)',
                  opacity: isHovered ? 1 : 0.6,
                }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={panel.image}
                  alt={panel.title}
                  fill
                  className="object-cover transition-all duration-500"
                  style={{ objectPosition: panel.objectPosition }}
                  priority
                  data-ai-hint={panel.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </motion.div>

              {/* Panel Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  animate={{ 
                    y: isHovered ? -20 : 0,
                    scale: isHovered ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-2 uppercase">
                    {panel.subtitle}
                  </p>
                  <h2 className="font-headline text-5xl lg:text-7xl font-black text-white tracking-tighter">
                    {panel.title}
                  </h2>
                </motion.div>

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.1 }}
                      className="mt-8"
                    >
                      <Link href={panel.href}>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black rounded-full px-8 h-12"
                        >
                          Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Borders for Panels */}
              {index < panels.length - 1 && (
                <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-white/10 z-10" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Layout: Snap Carousel */}
      <div className="flex md:hidden h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-black">
        {panels.map((panel) => (
          <div 
            key={panel.id} 
            className="flex-shrink-0 w-[85%] h-[80%] snap-center px-4"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden group">
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                className="object-cover"
                style={{ objectPosition: panel.objectPosition }}
                data-ai-hint={panel.hint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
                <p className="text-primary font-bold tracking-[0.3em] text-[8px] mb-1 uppercase">
                  {panel.subtitle}
                </p>
                <h2 className="font-headline text-4xl font-black text-white tracking-tighter mb-6">
                  {panel.title}
                </h2>
                <Link href={panel.href} className="w-full">
                  <Button className="w-full bg-primary text-white rounded-full h-12 font-bold uppercase tracking-widest text-xs">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Peek Spacing */}
        <div className="flex-shrink-0 w-8" />
      </div>
    </section>
  );
}
