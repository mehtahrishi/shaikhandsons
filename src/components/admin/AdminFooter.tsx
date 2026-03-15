
"use client"

import React from 'react';

export function AdminFooter() {
  return (
    <footer className="w-full h-16 border-t border-border/50 bg-background/50 backdrop-blur-md px-10 flex items-center justify-between relative z-[60]">
      <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
        © 2025 Shaikh & Sons — Fleet Command Core v2.4.0
      </p>
      <div className="flex gap-6">
        <span className="text-[8px] text-primary font-black uppercase tracking-[0.3em]">AES-256 Encrypted</span>
        <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">System Health: 98.2%</span>
      </div>
    </footer>
  );
}
