"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { name: 'Showroom', href: '/#showroom' },
    { name: 'Performance', href: '/#performance' },
    { name: 'Philosophy', href: '/#philosophy' },
    { name: 'Inquiry', href: '/#inquiry' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-background/95 backdrop-blur-md border-b border-border/50",
        isScrolled ? "py-3 shadow-sm" : "py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-headline text-2xl font-black tracking-tighter text-primary uppercase">SHAIKH</span>
          <span className="font-headline text-2xl font-light tracking-widest text-foreground uppercase">& SONS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-bold tracking-[0.2em] hover:text-primary transition-colors uppercase"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:inline-flex">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          <Button className="hidden md:flex rounded-full px-6 font-bold uppercase text-[10px] tracking-widest" variant="default" size="sm">
            Book Test Drive
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-background z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-headline text-2xl font-black text-primary">S | S</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-8 w-8" />
              </Button>
            </div>
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-headline font-bold hover:text-primary transition-colors uppercase tracking-tighter"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-muted" />
              <Link href="/admin/ai-tools" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Admin AI Tools</Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-widest text-muted-foreground uppercase">My Profile</Link>
            </nav>
            <div className="mt-auto">
              <Button className="w-full rounded-full h-14 font-black uppercase tracking-widest" size="lg">Request Quote</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
