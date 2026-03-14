
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Sun, Moon, User, LogIn, LogOut, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';

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

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('shaikh_auth_token') : null;
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('shaikh_auth_token');
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
    toast({
      title: "Signed Out",
      description: "Secure session terminated.",
    });
    router.push('/');
  };

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
        isScrolled ? "py-2 shadow-sm" : "py-4"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-10 md:h-12">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Mobile Menu Trigger on Left */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md bg-background border-r-border/50 flex flex-col p-0 overflow-hidden [&>button]:hidden no-scrollbar">
              <SheetHeader className="p-6 border-b border-border/50 flex flex-row items-center justify-between">
                <SheetTitle className="text-left">
                  <span className="font-headline text-base md:text-lg font-black text-primary uppercase">SHAIKH</span>
                  <span className="font-headline text-base md:text-lg font-light tracking-widest text-foreground uppercase"> & SONS</span>
                </SheetTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </Button>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col gap-8 no-scrollbar">
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link 
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-center justify-between py-1"
                      >
                        <span className="font-headline text-sm md:text-base font-bold tracking-tight uppercase group-hover:text-primary transition-colors">
                          {link.name}
                        </span>
                        <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto space-y-6 pb-8">
                  <div className="h-[1px] bg-border/50 w-full" />
                  
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-white/5">
                        <Avatar className="h-10 w-10 border border-primary/20">
                          <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                          <AvatarFallback>VN</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-[10px] uppercase tracking-tight">Julian Vane</p>
                          <p className="text-[8px] text-primary font-bold uppercase tracking-widest">Collector Member</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button asChild variant="outline" className="h-8 font-bold uppercase tracking-widest text-[8px]">
                          <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>My Garage</Link>
                        </Button>
                        <Button onClick={handleLogout} variant="destructive" className="h-8 font-bold uppercase tracking-widest text-[8px]">
                          Secure Logout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button asChild className="w-full h-10 rounded-full font-black uppercase tracking-[0.2em] text-[8px]">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Authorize Entry</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Centered Brand on Mobile */}
          <Link href="/" className="flex items-center gap-2 group mx-auto md:mx-0">
            <span className="font-headline text-base md:text-xl font-black tracking-tighter text-primary uppercase">SHAIKH</span>
            <span className="font-headline text-base md:text-xl font-light tracking-widest text-foreground uppercase flex items-center">
              <span className="relative inline-flex items-center justify-center mr-1">
                <span className="text-primary font-bold italic">&</span>
                <span className="absolute -top-1.5 -left-0.5 w-2.5 h-2.5 -rotate-[15deg] text-primary transition-transform group-hover:scale-110">
                  <CrownIcon />
                </span>
              </span>
              <span>SONS</span>
            </span>
          </Link>

          {/* Hidden Spacer to balance hamburger on mobile */}
          <div className="w-9 h-9 md:hidden" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[9px] font-bold tracking-[0.2em] hover:text-primary transition-colors uppercase"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="shrink-0 hidden md:flex">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="block">
            {!mounted ? (
              <div className="w-8 h-8" />
            ) : isAuthenticated ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full p-0 overflow-hidden border border-border/50 focus-visible:ring-offset-0 focus-visible:ring-0">
                    <Avatar className="h-8 w-8 md:h-9 md:w-9">
                      <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">VN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 mt-2 bg-background/95 backdrop-blur-xl border-border/50" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-black leading-none uppercase tracking-tight">Julian Vane</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 p-2">
                    <Link href="/profile" className="flex w-full items-center">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">My Garage</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer p-2">
                    <div className="flex w-full items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Secure Logout</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="flex gap-2 text-[9px] uppercase font-bold tracking-widest h-8 md:h-9 px-3">
                  <LogIn className="h-4 w-4 text-primary" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
