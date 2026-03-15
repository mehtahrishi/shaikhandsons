'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface AdminSession {
  user: AdminUser;
  expiresAt: number;
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const AdminAuthContext = createContext<AdminAuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedSessionStr = localStorage.getItem('shaikh_admin_session');
    if (savedSessionStr) {
      try {
        const session: AdminSession = JSON.parse(savedSessionStr);
        // Check if session is still valid (within 7 days)
        if (Date.now() < session.expiresAt) {
          setUser(session.user);
        } else {
          // Session expired
          localStorage.removeItem('shaikh_admin_session');
        }
      } catch (e) {
        localStorage.removeItem('shaikh_admin_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      const session: AdminSession = {
        user: data.user,
        expiresAt: Date.now() + SESSION_DURATION_MS
      };

      setUser(data.user);
      localStorage.setItem('shaikh_admin_session', JSON.stringify(session));
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('shaikh_admin_session');
    router.push('/admin/login');
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
