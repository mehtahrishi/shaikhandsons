"use client"

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, LogOut, Settings, Bell, ShieldCheck } from 'lucide-react';
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
import { useAdminAuth } from '@/context/AdminAuthContext';

export function AdminHeader() {
  const { user, logout } = useAdminAuth();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return <div className="h-20 border-b bg-background" />;

  return (
    <header className="h-20 border-b bg-background/95 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 md:px-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Operational Authority</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme} 
          className="text-foreground hover:bg-transparent transition-none"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <div className="h-8 w-px bg-border/50 hidden md:block" />

        {user && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 p-0 overflow-visible hover:bg-transparent focus-visible:ring-0 group">
                <span className="text-5xl font-headline font-black text-foreground hover:text-primary transition-colors select-none leading-none">
                  {user.email.charAt(0).toUpperCase()}
                </span>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mt-2 bg-background/95 backdrop-blur-xl border-border/50 p-2 rounded-2xl shadow-2xl" align="end">
              <DropdownMenuLabel className="p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Administrator</p>
                  <p className="text-xs font-bold truncate opacity-70">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="h-11 cursor-pointer rounded-xl px-3 font-body focus:bg-primary/10 focus:text-primary">
                <Settings className="h-4 w-4 mr-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Core Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="mt-1 h-11 cursor-pointer rounded-xl px-3 font-body text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="h-4 w-4 mr-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
