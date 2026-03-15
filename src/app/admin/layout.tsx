
"use client"

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-headline text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Initializing Command...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen bg-background overflow-hidden">
        <AdminNavbar />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <div className="flex flex-col flex-1 relative overflow-hidden">
            <main className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar">
              {children}
            </main>
            <AdminFooter />
          </div>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
