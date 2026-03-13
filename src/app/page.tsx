import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Typewriter } from '@/components/ui/Typewriter';
import { VehicleShowroom } from '@/components/vehicles/VehicleShowroom';
import { HeroSection } from '@/components/sections/HeroSection';
import { Zap, ShieldCheck, Leaf, ArrowRight, Gauge, Cpu, BatteryCharging } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Dynamic Hover Accordion Hero Section */}
      <HeroSection />

      {/* Tech Specs Bar */}
      <section className="bg-card border-y py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <p className="text-primary text-3xl font-black font-headline">1.8s</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">0-60 MPH</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-primary text-3xl font-black font-headline">840km</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Max Range</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-primary text-3xl font-black font-headline">15min</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">80% Charge</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-primary text-3xl font-black font-headline">A.I.</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Level 4 Autonomy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom */}
      <VehicleShowroom />

      {/* Engineering Philosophy Section */}
      <section id="philosophy" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="font-headline text-5xl md:text-7xl font-bold mb-8 leading-tight">
                  Intelligence <br /> <span className="text-primary italic">In Every Fiber.</span>
                </h2>
                <p className="text-muted-foreground text-xl leading-relaxed font-light">
                  Veridian Noir is more than a vehicle; it's a mobile sanctuary engineered with computational precision. Our solid-state battery architecture and neural-link interfaces redefine the boundary between driver and machine.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                    <BatteryCharging className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg uppercase tracking-wider">Solid-State Power</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Next-generation density providing unparalleled range and thermal stability in all climates.</p>
                </div>
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                    <Cpu className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg uppercase tracking-wider">Neural Compute</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Proprietary AI core processing 2,500 trillion operations per second for seamless autonomy.</p>
                </div>
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                    <Leaf className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg uppercase tracking-wider">Bio-Circular</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Interiors crafted from lab-grown silk and recycled ocean plastics, without compromise.</p>
                </div>
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg uppercase tracking-wider">Quantum Security</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Encryption that anticipates threats, ensuring your digital and physical footprint remains private.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://picsum.photos/seed/ev5/1200/1500" 
                  alt="Interior Luxury Technology" 
                  fill 
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  data-ai-hint="futuristic luxury car cockpit"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Technical Insight</p>
                  <p className="text-sm text-white/80 italic">"The cockpit doesn't just display information—it anticipates intent."</p>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-12 -right-12 h-64 w-64 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
              <div className="absolute -bottom-12 -left-12 h-64 w-64 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Section */}
      <section id="inquiry" className="py-32 bg-black text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(206,18,18,0.1)_0%,transparent_70%)]"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <h2 className="font-headline text-5xl md:text-8xl font-black mb-8 text-white tracking-tighter">
            The Future <br /> <span className="text-primary">Is An Inquiry Away</span>
          </h2>
          <p className="text-xl mb-12 text-white/60 font-light">
            Each Veridian Noir is a bespoke commission. Join the waitlist for our next production cycle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-16 h-16 text-lg font-black uppercase tracking-tighter shadow-[0_0_20px_rgba(206,18,18,0.3)]">
              Begin Configuration
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-16 h-16 text-lg font-bold border-white/10 text-white hover:bg-white/5">
              Contact Concierge
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-background border-t">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <span className="font-headline text-3xl font-black text-primary">VERIDIAN</span>
                <span className="font-headline text-3xl font-light tracking-widest text-foreground">NOIR</span>
              </Link>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                Defining the pinnacle of electronic luxury through transcendental engineering and uncompromising design.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">The Fleet</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Aether Sedan</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Lumina SUV</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Spectre GT</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Our Vision</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Technology</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-muted gap-4">
            <p className="text-muted-foreground text-[10px] tracking-widest uppercase font-medium">
              © 2025 Veridian Noir Automotive Group. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
