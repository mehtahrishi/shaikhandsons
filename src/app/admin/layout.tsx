
"use client"

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { Toaster } from '@/components/ui/toaster';

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
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-headline text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Initializing Command...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* 1. Sidebar (Desktop) */}
      <AdminSidebar />
      
      {/* Right Column (Header + Content) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Header */}
        <AdminHeader />
        
        {/* 3. Main Content Area */}
        <main className="flex-1 p-6 md:p-10 flex flex-col gap-10">
          {children}
        </main>
      </div>
      <Toaster />
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
