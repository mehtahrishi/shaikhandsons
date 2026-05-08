"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Customers", href: "/admin/users", icon: Users },
]

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

const BrandIdentity = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2 group whitespace-nowrap", className)}>
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
);

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-72 bg-card/40 border-r min-h-screen sticky top-0">
      {/* Brand Section */}
      <div className="h-20 flex items-center px-8 border-b">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <BrandIdentity />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-10 space-y-1">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6 px-4">
          Fleet Management
        </p>
        <div className="space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 group",
                pathname === item.href 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-colors", 
                pathname === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
              )} />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}