"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Globe, Lightbulb, ShieldCheck, Cpu, Sparkles, ArrowUpRight } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: "Global Reach", value: "40+", icon: Globe },
    { label: "Proprietary Tech", value: "120+", icon: Cpu },
    { label: "Safety Rating", value: "5.0", icon: ShieldCheck },
  ];

  const pillars = [
    {
      id: "01",
      title: "Innovation",
      desc: "Pushing the boundaries of solid-state battery technology and autonomous neural networks.",
      icon: Lightbulb
    },
    {
      id: "02",
      title: "Artistry",
      desc: "Every curve and stitch is a testament to our dedication to aesthetic excellence and human-centric design.",
      icon: Sparkles
    },
    {
      id: "03",
      title: "Responsibility",
      desc: "Engineering a carbon-negative future where luxury is defined by the legacy we leave for the next generation.",
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.15),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Corporate Profile</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
              Engineering <span className="text-primary">Eternity</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              At Shaikh & Sons, we don't just build electric vehicles. 
              We engineer transcendental experiences that bridge the gap 
              between high-art and sustainable innovation.
            </p>
          </motion.div>
        </div>
        
        {/* Animated Background HUD */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/5 rounded-full pointer-events-none animate-[spin_60s_linear_infinite]" />
      </section>

      {/* Stats HUD */}
      <section className="py-12 border-b border-border/40 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-card border border-border/40 hover:border-primary/40 transition-all group"
              >
                <stat.icon className="h-6 w-6 text-primary/60 group-hover:text-primary transition-colors mb-4" />
                <span className="text-4xl font-black text-foreground tabular-nums mb-1">{stat.value}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                  The Heritage
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                  A Legacy of <br />Uncompromising <span className="text-primary">Craft</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Founded on the principles of uncompromising craftsmanship, Shaikh & Sons began as a pursuit of perfection. 
                  Today, that legacy continues through our commitment to defining the pinnacle of electronic luxury. 
                  Every vehicle that leaves our facility is a masterclass in artisanal engineering.
                </p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-4 transition-all group">
                  Explore our History <ArrowUpRight className="h-4 w-4" />
                </button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square rounded-[3rem] overflow-hidden border border-border/40 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 pointer-events-none z-10 group-hover:opacity-0 transition-opacity" />
                <img 
                  src="https://picsum.photos/seed/heritage/1200/1200" 
                  alt="Heritage" 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[2.5rem] bg-card border border-border/40 hover:border-primary/40 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 text-7xl font-black text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none">
                    {pillar.id}
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <pillar.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-4 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 border-t border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-12">
            Experience the <span className="text-primary">Difference</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-10 py-5 bg-foreground text-background rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-xl">
              View Collection
            </button>
            <button className="px-10 py-5 bg-transparent border border-border rounded-full font-black uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-all duration-300">
              Contact Concierge
            </button>
          </div>
        </div>
      </section>

      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] z-50" />
    </div>
  );
}
