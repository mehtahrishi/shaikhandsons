"use client"

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { BrandIdentity } from "@/components/common/BrandIdentity";
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { SiteFooter } from '@/components/layout/SiteFooter';

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
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <div className="flex flex-1">
        {/* 1. Technical Sidebar */}
        <AdminSidebar />

        {/* 2. Mobile Dock Navbar (Bottom) */}
        <AdminNavbar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* 3. Command Header */}
          <AdminHeader />

          {/* 4. Operational Content Area */}
          <div className="flex-1 p-6 pt-24 md:pt-12 md:p-12 lg:p-16 flex flex-col gap-10 bg-background relative z-0">
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

      {/* 5. Site Footer - Full Width */}
      <div className="pb-16 md:pb-0">
        <SiteFooter showOnAdmin={true} />
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
