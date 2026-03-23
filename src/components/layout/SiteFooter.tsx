"use client"

import React from 'react';
import Link from 'next/link';

const CrownIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full">
    <g>
      <path d="M124.536,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S111.66,178.991,124.536,178.991z"/>
      <path d="M46.66,211.508c0-12.883-10.454-23.321-23.33-23.321C10.454,188.187,0,198.625,0,211.508 c0,12.884,10.454,23.322,23.33,23.322C36.206,234.83,46.66,224.392,46.66,211.508z"/>
      <path d="M387.464,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S374.588,178.991,387.464,178.991z"/>
      <path d="M488.686,188.187c-12.892,0-23.33,10.438-23.33,23.321c0,12.884,10.454,23.322,23.33,23.322 c12.876,0,23.314-10.438,23.314-23.322C512,198.625,501.562,188.187,488.686,188.187z"/>
      <rect x="80.101" y="399.236" width="351.815" height="36.296"/>
      <path d="M400.193,272.999c-33.932-23.322-14.839-82.694-14.839-82.694l-19.388-5.661 c-40.721,77.385-100.608,73.761-95.937-12.728v-27.715h33.686v-28.05h-33.686V76.468h-28.058v39.682h-33.702v28.05h33.702v27.715 c4.679,86.49-55.2,90.113-95.938,12.728l-19.371,5.661c0,0,19.076,59.372-14.839,82.694 c-33.932,23.321-63.626-33.923-63.626-33.923l-19.076,8.474L82.13,374.777H429.87l53.008-127.226l-19.076-8.474 C463.802,239.076,434.125,296.32,400.193,272.999z M170.852,321.058c-9.26,0-16.77-7.501-16.77-16.762 c0-9.252,7.51-16.753,16.77-16.753c9.244,0,16.753,7.501,16.753,16.753C187.606,313.557,180.096,321.058,170.852,321.058z M256.008,312.681c-9.26,0-16.762-7.501-16.762-16.762c0-9.252,7.501-16.753,16.762-16.753c9.252,0,16.753,7.501,16.753,16.753 C272.762,305.18,256.008,312.681,256.008,312.681z M341.164,321.058c-9.26,0-16.753-7.501-16.753-16.762 c0-9.252,7.493-16.753,16.753-16.753c9.26,0,16.753,7.501,16.753,16.753C357.918,313.557,350.425,321.058,341.164,321.058z"/>
    </g>
  </svg>
);

export function SiteFooter() {
  return (
    <footer className="py-20 bg-background border-t">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group whitespace-nowrap">
              <span className="font-headline font-black text-3xl tracking-tighter text-foreground uppercase transition-colors">
                SHAIKH
              </span>
              <span className="font-headline font-light text-3xl tracking-widest text-foreground uppercase flex items-center transition-colors">
                <span className="relative inline-flex items-center justify-center mr-1">
                  <span className="text-primary font-bold italic">&</span>
                  <span className="absolute -top-2 -left-1 w-4 h-4 -rotate-[15deg] text-primary transition-transform group-hover:scale-110">
                    <CrownIcon />
                  </span>
                </span>
                SONS
              </span>
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
            © {new Date().getFullYear()} Shaikh & Sons Automotive Group. All Rights Reserved.
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
