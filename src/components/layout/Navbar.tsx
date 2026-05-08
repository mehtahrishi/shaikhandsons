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

const BikeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 358.945 358.945" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M307.633,172.984c-6.389,0-12.61,1.174-18.524,3.479l-2.822-4.597l33.765-4.5c0.456-0.063,11.241-1.459,12.688-9.508
        c2.558-14.259-27.574-37.293-92.126-70.442c-5.915-2.747-10.227-4.086-13.181-4.086c-3.524,0-4.857,1.892-5.338,3.005
        c-2.606,6.008,9.121,21.804,20.645,35.245c-12.677-6.737-33.339-15.783-52.885-15.783c-9.833,0-18.417,2.306-25.517,6.854
        c-5.626,3.591-12.784,13.06-21.344,28.138c-0.375-0.597-0.987-1.015-1.684-1.132l-50.752-8.983l-7.071-21.227
        c-0.282-0.864-1.009-1.486-1.907-1.672c-0.973-0.184-24.085-4.666-44.883-4.666c-22.902,0-35.218,5.338-36.62,15.853
        c-3.278,24.761,99.893,57.601,121.84,64.294c-5.134,11.463-9.206,21.227-11.334,26.469c-6.395-21.432-26.667-36.74-49.146-36.74
        c-28.286,0-51.314,23.031-51.314,51.332c0,28.288,23.028,51.299,51.314,51.299c22.638,0,42.763-15.084,49.164-36.756h121.27
        c0.823,0,1.615-0.414,2.078-1.099l37.308-54.812l1.999,3.255c-10.778,9.733-16.939,23.574-16.939,38.106
        c0,28.294,23.022,51.299,51.317,51.299s51.312-23.005,51.312-51.299C358.945,196.016,335.921,172.984,307.633,172.984z
         M292.639,132.17c0.985-1.36,2.9-2.054,5.717-2.054c1.934,0,4.257,0.324,6.917,0.981c20.903,15.165,23.089,22.71,22.536,25.875
        c-0.78,4.398-8.305,5.419-8.395,5.425l-16.213,2.165C297.557,155.669,288.466,138.072,292.639,132.17z M93.274,219.038
        c-0.459,0.589-1.198,0.942-1.96,0.942H54.924v13.859h34.735c0.834,0,1.625,0.414,2.083,1.135c0.469,0.696,0.556,1.598,0.21,2.359
        c-5.233,12.244-17.219,20.158-30.522,20.158c-18.306,0-33.194-14.892-33.194-33.176c0-18.32,14.889-33.201,33.194-33.201
        c15.574,0,28.85,10.617,32.33,25.797C93.938,217.669,93.76,218.443,93.274,219.038z M307.633,257.492
        c-18.297,0-33.183-14.892-33.183-33.182c0-8.972,3.531-17.391,9.968-23.695c0.559-0.553,1.321-0.841,2.108-0.703
        c0.708,0.091,1.387,0.523,1.789,1.172l14.352,23.322l7.302-4.491l-14.346-23.323c-0.384-0.637-0.48-1.435-0.228-2.161
        c0.258-0.721,0.834-1.285,1.555-1.525c3.482-1.189,7.08-1.802,10.688-1.802c18.291,0,33.183,14.893,33.183,33.201
        C340.81,242.601,325.917,257.492,307.633,257.492z" fill="currentColor" />
    </g>
  </svg>
);

const ScootyIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 464.457 464.457" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M463.994,276.597c0.83-2.232,0.531-4.727-0.801-6.7c-12.385-18.357-32.975-29.317-55.084-29.317
        c-0.586,0-1.174,0.014-1.762,0.029v-8.667c0-4.204-3.008-7.807-7.145-8.558l-14.324-2.601l-14.793-59.729
        c-0.551-2.214-1.945-4.124-3.891-5.318l-5.086-3.126c0.77-0.502,1.521-1.028,2.24-1.601c2.072-1.65,3.279-4.154,3.279-6.804
        v-30.707c0-0.554-0.053-1.104-0.158-1.648l-0.771-4.001c-0.412-2.13-1.604-4.031-3.344-5.327
        c-6.635-4.942-15.295-6.933-23.434-5.361c-6.635-4.942-15.295-6.933-23.434-5.361c-8.01,1.545-14.65,6.188-18.926,12.443l-42.016,4.474
        c-7.164,0.763-12.354,7.189-11.592,14.354c0.715,6.695,6.373,11.666,12.959,11.666c0.459,0,0.928-0.024,1.396-0.075l35.552-3.785
        c1.256,4.203,3.4,7.985,6.197,11.152c0.014,0.03,0.021,0.061,0.033,0.091c10.322,23.743,33.264,91.222,15.729,117.964
        c-5.004,7.634-13.285,11.343-25.318,11.343h-48.647c-13.961,0-26.21-6.247-31.967-16.303c-6.205-10.835-4.744-25.234,4.195-41.802
        c2.625-1.497,4.394-4.322,4.394-7.56v-44.355c0-4.804-3.894-8.697-8.698-8.697H82.187c-4.803,0-8.697,3.894-8.697,8.697v37.693
        c-17.688,6.46-49.748,25.028-72.758,77.533C0.249,283.093,0,284.28,0,285.482v16.821c0,4.804,3.894,8.698,8.697,8.698H21.81
        c1.148,31.574,27.09,56.823,58.945,56.823c31.854,0,57.797-25.249,58.941-56.823h204.503c1.146,31.574,27.09,56.823,58.943,56.823
        c32.584,0,58.998-26.414,58.998-58.998c0-9.643-2.328-18.733-6.428-26.771l3.305-0.904
        C461.314,280.525,463.168,278.829,463.994,276.597z M102.228,227.229h37.333c2.763,0,5,2.239,5,5s-2.237,5-5,5h-37.333
        c-2.762,0-5-2.239-5-5S99.466,227.229,102.228,227.229z M80.755,331.706c-11.881,0-21.674-9.104-22.771-20.702h45.541
        C102.426,322.601,92.636,331.706,80.755,331.706z M139.561,273.563h-37.333c-2.762,0-5-2.238-5-5c0-2.761,2.238-5,5-5h37.333
        c2.763,0,5,2.239,5,5C144.561,271.325,142.324,273.563,139.561,273.563z M156.395,255.396h-71c-2.762,0-5-2.239-5-5s2.238-5,5-5h71
        c2.762,0,5,2.239,5,5S159.157,255.396,156.395,255.396z M403.145,331.706c-12.615,0-22.877-10.263-22.877-22.877
        c0-2.214,0.322-4.353,0.91-6.377l37.611-10.291c4.445,4.177,7.23,10.102,7.23,16.668
        C426.021,321.443,415.758,331.706,403.145,331.706z" fill="currentColor" />
    </g>
  </svg>
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [showAuthPopover, setShowAuthPopover] = useState(false);
  const [showVehiclesPopover, setShowVehiclesPopover] = useState(false);
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
              <button 
                onClick={toggleTheme} 
                className="h-9 w-9 flex items-center justify-center text-foreground hover:text-primary transition-colors rounded-lg"
              >
                {mounted ? (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <Sun className="h-4 w-4" />}
              </button>

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
            link.name === 'Vehicles' ? (
              <button 
                key="vehicles"
                onClick={() => { setShowAuthPopover(false); setShowVehiclesPopover(!showVehiclesPopover); }}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-foreground hover:text-primary",
                  showVehiclesPopover ? "text-primary" : "hover:bg-muted/50"
                )}
              >
                <link.icon className="h-5 w-5" />
                <span className="text-[6px] font-body font-black uppercase tracking-widest">{link.name}</span>
              </button>
            ) : (
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
            )
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
            <button 
              onClick={() => { setShowVehiclesPopover(false); setShowAuthPopover(!showAuthPopover); }}
              className={cn(
                "flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-foreground hover:text-primary transition-all",
                showAuthPopover ? "text-primary" : "hover:bg-muted/50"
              )}
            >
              <User className="h-5 w-5" />
              <span className="text-[6px] font-body font-black uppercase tracking-widest">Sign In</span>
            </button>
          )}
        </div>
      </nav>

      {/* Auth Bottom Sheet - Expands Upward */}
      <div className={cn(
        "fixed left-0 right-0 bottom-[56px] md:hidden z-30 bg-background/95 backdrop-blur-xl border-t border-border/50 overflow-hidden transition-all duration-300 ease-in-out",
        showAuthPopover ? "max-h-60" : "max-h-0"
      )}>
        <div className="px-4 py-6">
          <div className="px-2 mb-4">
            <h3 className="text-sm font-body font-black uppercase">Account Access</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/login" 
              onClick={() => setShowAuthPopover(false)}
              className="block"
            >
              <button className="w-full text-[12px] font-body font-black uppercase tracking-widest h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                Sign In
              </button>
            </Link>
            <Link 
              href="/signup" 
              onClick={() => setShowAuthPopover(false)}
              className="block"
            >
              <button className="w-full text-[12px] font-body font-black uppercase tracking-widest h-12 bg-primary/20 text-primary hover:bg-primary/30 rounded-xl">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Vehicles Bottom Sheet - Expands Upward */}
      <div className={cn(
        "fixed left-0 right-0 bottom-[56px] md:hidden z-30 bg-background/95 backdrop-blur-xl border-t border-border/50 overflow-hidden transition-all duration-300 ease-in-out",
        showVehiclesPopover ? "max-h-60" : "max-h-0"
      )}>
        <div className="px-4 py-6">
          <div className="px-2 mb-4">
            <h3 className="text-sm font-body font-black uppercase">Select Vehicle Type</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/?type=bikes" 
              onClick={() => setShowVehiclesPopover(false)}
              className="block"
            >
              <button className="w-full text-[12px] font-body font-black uppercase tracking-widest h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl flex items-center justify-center gap-2 px-4">
                <BikeIcon className="w-6 h-6" />
                <span>Bikes</span>
              </button>
            </Link>
            <Link 
              href="/?type=scooters" 
              onClick={() => setShowVehiclesPopover(false)}
              className="block"
            >
              <button className="w-full text-[12px] font-body font-black uppercase tracking-widest h-12 bg-primary/20 text-primary hover:bg-primary/30 rounded-xl flex items-center justify-center gap-2 px-4">
                <ScootyIcon className="w-6 h-6" />
                <span>Scooty</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
