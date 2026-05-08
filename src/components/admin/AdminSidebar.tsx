"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BrandIdentity } from "./BrandIdentity"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Customers", href: "/admin/users", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside className={cn(
      "hidden md:flex flex-col bg-card/40 border-r min-h-screen sticky top-0 transition-all duration-300 ease-in-out z-40",
      isCollapsed ? "w-20" : "w-72"
    )}>
      {/* Brand Section */}
      <div className={cn(
        "h-20 flex items-center border-b px-4 transition-all duration-300",
        isCollapsed ? "justify-center" : "px-8"
      )}>
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <BrandIdentity collapsed={isCollapsed} />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-10 space-y-1 relative">
        <p className={cn(
          "text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6 px-4 transition-opacity duration-200 overflow-hidden whitespace-nowrap",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
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
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                isCollapsed && "justify-center px-0 h-12 w-12 mx-auto"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-colors", 
                pathname === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
              )} />
              <span className={cn(
                "transition-all duration-300 origin-left",
                isCollapsed ? "w-0 opacity-0 scale-0 absolute" : "w-auto opacity-100 scale-100"
              )}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Repositioned Toggle Button - Moved Up */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 h-6 w-6 rounded-full border bg-background flex items-center justify-center hover:bg-muted transition-colors z-50"
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
      </nav>
    </aside>
  );
}