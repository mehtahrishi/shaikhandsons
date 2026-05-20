"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * PageWrapper
 * Dynamically handles layout offsets to prevent collisions between fixed headers and page content.
 * Disables offsets for Admin routes to ensure full-bleed technical layouts.
 */
export function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div className={cn(
      "flex-1 flex flex-col",
      !isAdmin && "pt-[92px] md:pt-[100px] pb-16 md:pb-0"
    )}>
      {children}
    </div>
  );
}
