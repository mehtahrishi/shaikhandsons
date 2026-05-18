"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, MessageCircle } from 'lucide-react';
import { BrandIdentity } from '@/components/common/BrandIdentity';



export function SiteFooter({ showOnAdmin = false }: { showOnAdmin?: boolean }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute && pathname !== '/admin/login' && !showOnAdmin) return null;

  return (
    <footer className="bg-background border-t border-muted">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Brand Section */}
            <div className="md:col-span-1 lg:col-span-1">
              <Link href="/" className="mb-6 block hover:opacity-80 transition-opacity">
                <BrandIdentity size="xl" />
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
