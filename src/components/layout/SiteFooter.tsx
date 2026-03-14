
"use client"

import React from 'react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="py-20 bg-background border-t">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="font-headline text-3xl font-black text-primary">SHAIKH</span>
              <span className="font-headline text-3xl font-light tracking-widest text-foreground">& SONS</span>
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
            © 2025 Shaikh & Sons Automotive Group. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
