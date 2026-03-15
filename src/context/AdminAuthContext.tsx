
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCurrentUser, signOut, type AuthUser } from '@/lib/appwrite/auth';

interface AdminAuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const currentUser = await getCurrentUser();
    // In a real app, you might check for an 'admin' label here
    setUser(currentUser);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AdminAuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
