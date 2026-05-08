"use client"

import React from 'react';

export function AdminFooter() {
  return (
    <footer className="w-full border-t bg-background px-6 md:px-10 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-black">
            © {new Date().getFullYear()} Shaikh & Sons — Precision Mobility Registry
          </p>
        </div>
      </div>
    </footer>
  );
}