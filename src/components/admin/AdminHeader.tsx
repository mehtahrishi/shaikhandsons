"use client"

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Sun, Moon, LogOut, LayoutDashboard, ShoppingCart, Package, Users, Sparkles, X } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAdminAuth } from '@/context/AdminAuthContext';

const CrownIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full">
    <path d="M124.536,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S111.66,178.991,124.536,178.991z"/>
    <path d="M46.66,211.508c0-12.883-10.454-23.321-23.33-23.321C10.454,188.187,0,198.625,0,211.508 c0,12.884,10.454,23.322,23.33,23.322C36.206,234.83,46.66,224.392,46.66,211.508z"/>
    <path d="M387.464,178.991c12.892,0,23.33-10.438,23.33-23.322s-10.438-23.322-23.33-23.322 c-12.876,0-23.314,10.438-23.314,23.322S374.588,178.991,387.464,178.991z"/>
    <path d="M488.686,188.187c-12.892,0-23.33,10.438-23.33,23.321c0,12.884,10.454,23.322,23.33,23.322 c12.876,0,23.314-10.438,23.314-23.322C512,198.625,501.562,188.187,488.686,188.187z"/>
    <rect x="80.101" y="399.236" width="351.815" height="36.296"/>
    <path d="M400.193,272.999c-33.932-23.322-14.839-82.694-14.839-82.694l-19.388-5.661 c-40.721,77.385-100.608,73.761-95.937-12.728v-27.715h33.686v-28.05h-33.686V76.468h-28.058v39.682h-33.702v28.05h33.702v27.715 c4.679,86.49-55.2,90.113-95.938,12.728l-19.371,5.661c0,0,19.076,59.372-14.839,82.694 c-33.932,23.321-63.626-33.923-63.626-33.923l-19.076,8.474L82.13,374.777H429.87l53.008-127.226l-19.076-8.474 C463.802,239.076,434.125,296.32,400.193,272.999z"/>
  </svg>
);

export function AdminHeader() {
  const { user, logout } = useAdminAuth();
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('shaikh_theme') || 'dark';
    const isCurrentlyDark = savedTheme === 'dark';
    setIsDark(isCurrentlyDark);
    if (isCurrentlyDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    const theme = nextIsDark ? 'dark' : 'light';
    if (nextIsDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('shaikh_theme', theme);
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/inventory", icon: Package },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "AI Synthesis", href: "/admin/ai-tools", icon: Sparkles },
  ];

  return (
    <header className="h-20 border-b bg-background/95 backdrop-blur-md sticky top-0 z-50 flex items-center px-6 md:px-10">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden mr-4">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] bg-background/95 backdrop-blur-md border-r-border/50 p-0 flex flex-col no-scrollbar [&>button]:hidden">
          <SheetHeader className="px-6 h-[76px] flex flex-row items-center justify-between shrink-0">
            <SheetTitle>
              <div className="flex items-center gap-2 group whitespace-nowrap">
                <span className="font-headline font-black text-lg tracking-tighter text-foreground uppercase">SHAIKH</span>
                <span className="font-headline font-light text-lg tracking-widest text-foreground uppercase flex items-center">
                  <span className="relative inline-flex items-center justify-center mr-1">
                    <span className="text-primary font-bold italic">&</span>
                    <span className="absolute -top-1.5 -left-0.5 w-2.5 h-2.5 -rotate-[15deg] text-primary">
                      <CrownIcon />
                    </span>
                  </span>
                  SONS
                </span>
              </div>
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </SheetHeader>
          <nav className="flex-1 px-8 py-8 space-y-6">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between group py-2",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <span className="font-headline text-lg font-bold tracking-tight uppercase group-hover:text-primary transition-colors">
                  {item.name}
                </span>
                <item.icon className="h-5 w-5" />
              </a>
            ))}
          </nav>
          <div className="p-8 border-t">
            <Button variant="destructive" className="w-full font-black uppercase tracking-widest text-[10px] h-12" onClick={logout}>
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="text-foreground hover:bg-transparent hover:text-foreground focus-visible:ring-0"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {user && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 p-0 overflow-visible hover:bg-transparent focus-visible:ring-0 group">
                <span className="text-5xl font-headline font-black text-foreground group-hover:text-primary transition-colors select-none leading-none">
                  A
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mt-2 bg-background/95 backdrop-blur-xl border-border/50" align="end">
              <DropdownMenuLabel className="p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Admin</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer p-4">
                <div className="flex w-full items-center gap-3">
                  <LogOut className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}