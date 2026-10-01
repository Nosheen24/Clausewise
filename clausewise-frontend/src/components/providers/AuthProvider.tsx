'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types';
import { AuthAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_COOKIE = 'clausewise_auth';
const ACCESS_TOKEN_KEY = 'clausewise_access_token';
const REFRESH_TOKEN_KEY = 'clausewise_refresh_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await AuthAPI.getProfile();
      if (profile) {
        persistUser(profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return false;
    }
  }, [persistUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await AuthAPI.login(email, password);
      const { user, tokens } = response;
      persistUser(user);
      // Store tokens for JWT authentication
      if (tokens?.access && tokens?.refresh) {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
      } else if ((user as any).accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, (user as any).accessToken);
      }
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [persistUser]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await AuthAPI.register(email, name, password, password);
      const { user, tokens } = response;
      persistUser(user);
      // Store tokens for JWT authentication
      if (tokens?.access && tokens?.refresh) {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
      } else if ((user as any).accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, (user as any).accessToken);
      }
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await AuthAPI.logout(refreshToken);
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      persistUser(null);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, [persistUser]);

  const refreshAuthToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) return false;

      const response = await AuthAPI.refreshToken(refreshToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, response.access);
      if (response.refresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh);
      }
      await fetchProfile();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      persistUser(null);
      return false;
    }
  }, [fetchProfile, persistUser]);

  useEffect(() => {
    if (mounted && !user) {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (accessToken) {
        fetchProfile();
      }
    }
  }, [mounted, user, fetchProfile]);

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      refreshToken: refreshAuthToken,
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