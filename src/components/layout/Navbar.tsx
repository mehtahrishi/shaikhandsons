"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bike, Sun, Moon, User, LogOut, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

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

const BrandIdentity = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) => (
  <div className={cn("flex items-center gap-2 group whitespace-nowrap", className)}>
    <span className={cn(
      "font-headline font-black tracking-tighter text-foreground uppercase transition-colors",
      size === "sm" ? "text-xs" : size === "md" ? "text-sm md:text-lg" : "text-lg md:text-2xl"
    )}>
      SHAIKH
    </span>
    <span className={cn(
      "font-headline tracking-widest text-foreground uppercase flex items-center transition-colors",
      size === "sm" ? "text-xs" : size === "md" ? "text-sm md:text-lg" : "text-lg md:text-2xl"
    )}>
      <span className="relative inline-flex items-center justify-center mr-1">
        <span className="font-headline text-primary font-bold italic">&</span>
        <span className="absolute -top-1.5 -left-0.5 w-2.5 h-2.5 -rotate-[15deg] text-primary">
          <CrownIcon />
        </span>
      </span>
      <span className="font-headline">SONS</span>
    </span>
  </div>
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const isAuthenticated = !!user;
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem('shaikh_theme');
    if (savedTheme) {
      const isCurrentlyDark = savedTheme === 'dark';
      setIsDark(isCurrentlyDark);
      if (isCurrentlyDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolled(currentScrollY > 20);
        lastScrollY = currentScrollY;
      }, 0);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Signed Out",
      description: "Secure session terminated.",
    });
    router.push('/');
  };

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    if (nextIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('shaikh_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('shaikh_theme', 'light');
    }
  };

  if (isAdminRoute && pathname !== '/admin/login') return null;

  const navLinks = [
    { name: 'Vehicles', href: '/#showroom', icon: Home },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const mobileNavLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Vehicles', href: '/#showroom', icon: Bike },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const userInitial = user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "C";

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-50">
        <div className={cn(
          "transition-all duration-300 bg-background/95 backdrop-blur-md border-b border-border/50",
          isScrolled && "shadow-md"
        )}>
          <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            {/* Left: Brand */}
            <Link href="/" className="flex items-center">
              <BrandIdentity size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-[10px] font-body font-black tracking-widest text-foreground hover:text-primary transition-colors uppercase relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right: Theme + Auth */}
            <div className="flex items-center gap-2 md:gap-3 ml-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="h-9 w-9 hover:bg-muted/50 text-foreground rounded-lg"
              >
                {mounted ? (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <Sun className="h-4 w-4" />}
              </Button>

              {/* Desktop Auth */}
              {!mounted ? (
                <div className="w-9 h-9" />
              ) : isAuthenticated ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-9 w-9 p-0 hover:bg-muted/50 group transition-all rounded-lg"
                    >
                      <span className="text-xl font-headline font-black text-foreground group-hover:text-primary">
                        {userInitial}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-52 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-lg" 
                    align="end" 
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs font-headline font-black">{user?.fullName || user?.email?.split('@')[0] || "Collector"}</p>
                        <p className="text-[10px] font-body text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 p-2 rounded font-body">
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">My Garage</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer p-2 rounded font-body">
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-1">
                  <Link href="/login">
                    <Button 
                      size="sm" 
                      className="text-[10px] font-body font-black uppercase tracking-widest h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button 
                      size="sm" 
                      className="text-[10px] font-body font-black uppercase tracking-widest h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg hidden md:inline-flex"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-background/95 backdrop-blur-md border-t border-border/50 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {mobileNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all text-foreground hover:text-primary",
                pathname === link.href ? "text-primary" : "hover:bg-muted/50"
              )}
            >
              <link.icon className="h-5 w-5" />
              <span className="text-[6px] font-body font-black uppercase tracking-widest">{link.name}</span>
            </Link>
          ))}
          
          {/* Auth/Profile Icon */}
          {!mounted ? (
            <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg" />
          ) : isAuthenticated ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all text-foreground hover:text-primary hover:bg-muted/50">
                  <User className="h-5 w-5" />
                  <span className="text-[6px] font-body font-black uppercase tracking-widest">Profile</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-48 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-lg" 
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-headline font-black">{user?.fullName || user?.email?.split('@')[0] || "Collector"}</p>
                    <p className="text-[10px] font-body text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 p-2 rounded font-body">
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">My Garage</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer p-2 rounded font-body">
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all text-foreground hover:text-primary hover:bg-muted/50"
            >
              <User className="h-5 w-5" />
              <span className="text-[6px] font-body font-black uppercase tracking-widest">Sign In</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
