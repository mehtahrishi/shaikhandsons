"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, MessageCircle } from 'lucide-react';

const CrownIcon = () => (
// ... existing CrownIcon ...
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
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute && pathname !== '/admin/login') return null;

  return (
    <footer className="bg-background border-t border-muted">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Brand Section */}
            <div className="md:col-span-1 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6 whitespace-nowrap">
                <span className="font-headline font-black text-3xl tracking-tighter text-foreground uppercase">
                  SHAIKH
                </span>
                <span className="font-headline font-light text-3xl tracking-widest text-foreground uppercase flex items-center">
                  <span className="relative inline-flex items-center justify-center mr-1">
                    <span className="text-primary font-bold italic">&</span>
                    <span className="absolute -top-2 -left-1 w-4 h-4 -rotate-[15deg] text-primary">
                      <CrownIcon />
                    </span>
                  </span>
                  SONS
                </span>
              </Link>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed font-light">
                Redefining electric luxury through cutting-edge engineering and uncompromising commitment to sustainable innovation.
              </p>
              {/* Social Icons */}
              <div className="flex gap-4 mt-6">
                <Link href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/30 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300">
                  <Instagram size={18} />
                </Link>
                <Link href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/30 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300" aria-label="WhatsApp">
                  <MessageCircle size={18} />
                </Link>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.4em] font-bold text-primary mb-1">COMPANY</h4>
                <div className="w-8 h-0.5 bg-muted/20"></div>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative inline-block group">
                    About Us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative inline-block group">
                    Contact
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative inline-block group">
                    Vehicles
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.4em] font-bold text-primary mb-1">SUPPORT</h4>
                <div className="w-8 h-0.5 bg-muted/20"></div>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative inline-block group">
                    Privacy Policy
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative inline-block group">
                    Terms of Service
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
              
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-muted"></div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-muted/20">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center">
            <p className="text-muted-foreground text-[11px] uppercase tracking-[0.2em] font-medium">
              © {new Date().getFullYear()} Shaikh and Sons. All rights reserved.
            </p>

            <div className="hidden md:block w-px h-3 bg-muted/40 mx-2"></div>

            <div className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
              Crafted by <a href="https://hrishi-portfolio-two.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors duration-300 font-semibold tracking-wider">
                Hrishi Mehta
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
