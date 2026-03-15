
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Settings, 
  Sparkles, 
  LogOut,
  Zap
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Fleet Inventory", href: "/admin/inventory", icon: Car },
  { name: "AI Tools", href: "/admin/ai-tools", icon: Sparkles },
  { name: "Collectors", href: "/admin/users", icon: Users },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const { state } = useSidebar()

  const userInitial = user?.name?.charAt(0).toUpperCase() || "A";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-card/40 backdrop-blur-xl h-full">
      <SidebarContent className="px-4 py-6">
        <div className="mb-8">
           <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 px-2", state === "collapsed" && "hidden")}>
             Operations
           </p>
           <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.name}
                  className="h-11 rounded-lg hover:bg-primary/10 hover:text-primary transition-all group px-3"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", pathname === item.href ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')} />
                    <span className="font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                      {item.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        <div className={cn("p-4 bg-primary/5 rounded-xl border border-primary/10 mt-auto", state === "collapsed" && "hidden")}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">System Health</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[94%] bg-primary" />
          </div>
          <p className="text-[8px] text-muted-foreground mt-2 uppercase tracking-widest">Efficiency: 98.2%</p>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <Button 
          variant="ghost" 
          onClick={logout}
          className="w-full justify-start gap-3 h-10 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive group px-3"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="font-bold text-[10px] uppercase tracking-widest group-data-[collapsible=icon]:hidden">Terminate Session</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
