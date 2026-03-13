
"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroSection() {
  // Middle index (1) is selected by default for desktop
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(1);
  const [activeMobileIndex, setActiveMobileIndex] = useState(1);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const panels = [
    {
      id: 'aether',
      title: 'AETHER',
      subtitle: 'TRANSCENDENTAL SEDAN',
      image: '/images/1.png',
      hint: 'electric sedan teal',
      href: '/vehicles/v1',
      objectPosition: '20% center'
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
      objectPosition: '80% center'
    }
  ];

  const scrollToPanel = (index: number) => {
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollTo({
        left: index * mobileCarouselRef.current.offsetWidth,
        behavior: 'smooth'
      });
      setActiveMobileIndex(index);
    }
  };

  // Initial scroll to middle on mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        scrollToPanel(1);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle mobile scroll sync for dots
  useEffect(() => {
    const el = mobileCarouselRef.current;
    if (!el) return;

    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      if (!isNaN(index) && index !== activeMobileIndex) {
        setActiveMobileIndex(index);
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [activeMobileIndex]);

  return (
    <section className="relative h-[75vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] w-full bg-black overflow-hidden pt-[72px]">
      {/* Desktop Layout: Reveal Accordion */}
      <div className="hidden md:flex h-full w-full">
        {panels.map((panel, index) => {
          const isHovered = hoveredIndex === index;
          const isAnyHovered = hoveredIndex !== null;
          
          let flexValue = 1;
          if (isAnyHovered) {
            flexValue = isHovered ? 1.8 : 0.6;
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
              <div className="absolute inset-0 w-full h-full">
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
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
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

      {/* Mobile Layout: Enhanced Snap Carousel */}
      <div className="md:hidden relative h-full w-full bg-black">
        <div 
          ref={mobileCarouselRef}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {panels.map((panel) => (
            <div 
              key={panel.id} 
              className="flex-shrink-0 w-full h-full snap-center relative flex flex-col items-center justify-center bg-black"
            >
              <div className="relative w-full h-3/4">
                <Image
                  src={panel.image}
                  alt={panel.title}
                  fill
                  className="object-contain"
                  data-ai-hint={panel.hint}
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 pb-20 flex flex-col items-center text-center">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-primary font-bold tracking-[0.3em] text-[10px] mb-2 uppercase"
                >
                  {panel.subtitle}
                </motion.p>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-headline text-5xl font-black text-white tracking-tighter mb-8"
                >
                  {panel.title}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-xs"
                >
                  <Link href={panel.href}>
                    <Button className="w-full bg-primary text-white rounded-full h-14 font-bold uppercase tracking-widest text-xs">
                      View Collection
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {panels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToPanel(idx)}
              className={cn(
                "h-1.5 transition-all duration-300 rounded-full",
                activeMobileIndex === idx ? "w-10 bg-primary" : "w-4 bg-white/20"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full bg-white/5 backdrop-blur-sm text-white/40 hover:text-white pointer-events-auto w-12 h-12",
              activeMobileIndex === 0 && "opacity-0 pointer-events-none"
            )}
            onClick={() => scrollToPanel(activeMobileIndex - 1)}
          >
            <ChevronLeft className="h-10 w-10" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full bg-white/5 backdrop-blur-sm text-white/40 hover:text-white pointer-events-auto w-12 h-12",
              activeMobileIndex === panels.length - 1 && "opacity-0 pointer-events-none"
            )}
            onClick={() => scrollToPanel(activeMobileIndex + 1)}
          >
            <ChevronRight className="h-10 w-10" />
          </Button>
        </div>
      </div>
    </section>
  );
}
