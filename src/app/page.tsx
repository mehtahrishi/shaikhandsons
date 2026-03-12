
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Typewriter } from '@/components/ui/Typewriter';
import { VehicleShowroom } from '@/components/vehicles/VehicleShowroom';
import { Zap, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Image 
          src="https://picsum.photos/seed/ev1/1920/1080"
          alt="Luxury EV Hero"
          fill
          priority
          className="object-cover brightness-50"
          data-ai-hint="luxury electric car dark"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
        
        <div className="container relative z-10 px-6 text-center">
          <p className="text-primary font-bold uppercase tracking-[0.5em] mb-6 animate-pulse">
            Experience Tomorrow
          </p>
          <h1 className="font-headline text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 leading-none">
            <Typewriter text="VERIDIAN" delay={4500} />
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white/40 italic">
              NOIR
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/80 text-lg md:text-xl font-light mb-12">
            The intersection of high-fashion editorial and cutting-edge electronic engineering. Redefining what it means to travel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold">
              View Showroom
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg border-white/20 text-white hover:bg-white hover:text-black">
              Our Vision
            </Button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Showroom */}
      <VehicleShowroom />

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 bg-card border-y">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px] rounded-lg overflow-hidden group">
              <Image 
                src="https://picsum.photos/seed/ev5/1200/800" 
                alt="Interior Luxury" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                data-ai-hint="futuristic car interior"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div>
              <h2 className="font-headline text-4xl md:text-6xl font-bold mb-8">Elegance is <span className="text-primary italic">Electric</span></h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Veridian Noir wasn't just built to move people. It was built to move the soul. We combine the sophistication of haute couture with the precision of silicon valley.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl uppercase tracking-wider">Sustainable</h3>
                  <p className="text-sm text-muted-foreground">Crafted with vegan leathers and recycled carbon composites.</p>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl uppercase tracking-wider">Secure</h3>
                  <p className="text-sm text-muted-foreground">Military-grade encryption for all vehicle systems.</p>
                </div>
              </div>

              <Button variant="link" className="mt-12 text-primary p-0 h-auto group text-lg">
                Read our Manifesto <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="inquiry" className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-headline text-5xl md:text-7xl font-black mb-8">Begin Your Journey</h2>
          <p className="text-xl mb-12 opacity-90">
            Request a personalized consultation with our Veridian Specialists.
          </p>
          <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-lg font-black uppercase tracking-tighter">
            Request Inquiry
          </Button>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-headline text-xl font-black text-primary">VERIDIAN</span>
            <span className="font-headline text-xl font-light tracking-widest text-foreground">NOIR</span>
          </div>
          <div className="flex gap-8 text-xs uppercase tracking-widest font-bold">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Careers</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </div>
          <p className="text-muted-foreground text-[10px] tracking-widest uppercase">
            © 2025 Veridian Noir Automotive Group
          </p>
        </div>
      </footer>
    </div>
  );
}

import Link from 'next/link';
