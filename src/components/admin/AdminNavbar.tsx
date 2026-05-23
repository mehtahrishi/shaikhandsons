"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Award,
  Tag,
  Sliders,
  Heart
} from "lucide-react"
import { cn } from '@/lib/utils';
import { BrandIdentity } from '@/components/common/BrandIdentity';

const navItems = [
  { name: "Dash", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Fleet", href: "/admin/inventory", icon: Package },
  { name: "Variants", href: "/admin/variants", icon: Sliders },
  { name: "Brands", href: "/admin/brands", icon: Award },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Likes", href: "/admin/likes", icon: Heart },
]

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t z-50 md:hidden overflow-hidden">
      <div className="flex items-center gap-1 h-full px-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[72px] transition-all duration-300 snap-center",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-300",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest whitespace-nowrap",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
