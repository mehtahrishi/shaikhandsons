'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/types/auth';
import { adminLogin, getCurrentAdmin, adminLogout } from '@/lib/auth/auth-client';

interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAdminSession = useCallback(async () => {
    try {
      setLoading(true);
      const admin = await getCurrentAdmin();
      setUser(admin);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminSession();
  }, [fetchAdminSession]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const admin = await adminLogin(email, password);
      setUser(admin);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await adminLogout();
    } finally {
      setUser(null);
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
