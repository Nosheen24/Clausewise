'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@clausewise.com', role: 'legal' },
  { id: 'u2', name: 'James Wilson', email: 'james@clausewise.com', role: 'contract_manager' },
  { id: 'u3', name: 'Emily Davis', email: 'emily@clausewise.com', role: 'business' },
  { id: 'u4', name: 'Admin', email: 'admin@clausewise.com', role: 'admin' },
];

const AUTH_COOKIE = 'clausewise_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${AUTH_COOKIE}=`));

    if (cookie) {
      try {
        const savedUser = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        setUser(savedUser);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const persistUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    if (nextUser) {
      document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(JSON.stringify(nextUser))}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    } else {
      document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    }
  }, []);

  const login = useCallback((email: string, _password: string) => {
    const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      persistUser(found);
      return true;
    }
    persistUser({ id: 'demo', name: 'Demo User', email, role: 'business' });
    return true;
  }, [persistUser]);

  const signup = useCallback((name: string, email: string, _password: string) => {
    persistUser({ id: `u-${Date.now()}`, name, email, role: 'business' });
    return true;
  }, [persistUser]);

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}