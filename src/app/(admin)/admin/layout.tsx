"use client"

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { BrandIdentity } from "@/components/admin/BrandIdentity";
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 pb-16 md:pb-0">
      {/* 1. Technical Sidebar */}
      <AdminSidebar />
      
      {/* 2. Mobile Dock Navbar (Bottom) */}
      <AdminNavbar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* 3. Mobile Top Brand Bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-12 bg-background/95 backdrop-blur-md border-b flex items-center justify-center z-50">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <BrandIdentity className="scale-75" />
          </Link>
        </div>

        {/* 4. Command Header */}
        <AdminHeader />
        
        {/* 3. Operational Content Area */}
        <div className="flex-1 p-6 pt-32 md:pt-12 md:p-12 lg:p-16 flex flex-col gap-10 bg-background relative z-0">
          {loading && !user ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="font-headline text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Initializing Registry...</p>
            </div>
          ) : !user && pathname !== '/admin/login' ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AdminAuthProvider>
  );
}
