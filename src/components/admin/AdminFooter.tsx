
"use client"

import React from 'react';

export function AdminFooter() {
  return (
    <footer className="w-full h-20 border-t bg-muted/20 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 py-6">
      <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold text-center md:text-left">
        © 2025 Shaikh & Sons — Fleet Command Core v2.5.0
      </p>
      <div className="flex items-center gap-6">
        <span className="text-[8px] text-primary font-black uppercase tracking-[0.3em]">AES-256 Cloud Encrypted</span>
        <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Latency: 24ms</span>
      </div>
    </footer>
  );
}
