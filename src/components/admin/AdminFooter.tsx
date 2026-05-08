"use client"

import React from 'react';
import { ShieldCheck, Cpu, Globe } from 'lucide-react';

export function AdminFooter() {
  return (
    <footer className="w-full border-t bg-background px-6 md:px-10 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-black">
            © {new Date().getFullYear()} Shaikh & Sons — Precision Mobility Registry
          </p>
          <div className="flex items-center gap-4 opacity-50">
            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest">
              <Globe className="h-2.5 w-2.5" />
              Global Fleet Node
            </div>
            <div className="h-1 w-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest">
              <Cpu className="h-2.5 w-2.5" />
              Neural Architecture
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[8px] text-primary font-black uppercase tracking-[0.3em]">Secure Environment</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">AES-256 Cloud Encrypted</span>
            </div>
          </div>
          <div className="h-10 w-px bg-border/50" />
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">System Latency</p>
            <p className="text-[10px] font-black text-primary tracking-tighter">14ms / OPR_SUCCESS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
