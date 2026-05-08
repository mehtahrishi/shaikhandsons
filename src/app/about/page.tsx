"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, Cpu, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const stats = [
    { label: "Global Presence", value: "40+ Locations", icon: Globe },
    { label: "Patented Tech", value: "120+ Assets", icon: Cpu },
    { label: "Safety Rating", value: "5.0 Grade", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] relative flex flex-col items-center overflow-hidden bg-background py-12">
      {/* Dynamic Background Accents - Matching Login/Contact Pages */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl px-6 z-10 space-y-20"
      >
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="font-headline text-6xl md:text-8xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
            Our <span className="text-primary italic">Legacy</span>
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm font-bold tracking-[0.3em] uppercase max-w-2xl mx-auto">
            Defining the pinnacle of electric luxury through advanced engineering
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="font-headline text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">
                Uncompromising <span className="text-primary italic">Craftsmanship.</span>
              </h2>
              <div className="h-1 w-20 bg-primary/20" />
              <p className="text-muted-foreground text-lg leading-relaxed font-light">
                Founded on the principles of perfection, Shaikh & Sons began as a pursuit to redefine movement. 
                Today, we bridge the gap between art and sustainable innovation, ensuring every vehicle 
                is a masterclass in expert engineering.
              </p>
            </div>

            {/* Simple Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border/50">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <stat.icon className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tighter uppercase">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="pt-12 flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all">
                <Link href="/#showroom">
                  Explore Collection
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 border-border hover:bg-muted/50 text-foreground font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>

       
      </motion.div>
    </div>
  );
}
