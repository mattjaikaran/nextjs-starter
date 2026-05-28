'use client';

import type {
  AuthState,
  AuthTokens,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types';
import { create } from 'zustand';

export interface AuthSlice extends AuthState {
  login: (data: { user: User; tokens: AuthTokens }) => void;
  register: (data: { user: User; tokens: AuthTokens }) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthSlice>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.tokens.accessToken);
      localStorage.setItem('refresh_token', data.tokens.refreshToken);
      localStorage.setItem('user:v1', JSON.stringify(data.user));
    }
    set({
      user: data.user,
      tokens: data.tokens,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  register: (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.tokens.accessToken);
      localStorage.setItem('refresh_token', data.tokens.refreshToken);
      localStorage.setItem('user:v1', JSON.stringify(data.user));
    }
    set({
      user: data.user,
      tokens: data.tokens,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user:v1');
    }
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  setUser: (user) => {
    set({ user });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user:v1', JSON.stringify(user));
    }
  },

  setTokens: (tokens) => {
    set({ tokens });
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  initializeAuth: () => {
    if (typeof window === 'undefined') return;
    try {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const userStr = localStorage.getItem('user:v1');

      if (token && refreshToken && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          tokens: { accessToken: token, refreshToken },
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user:v1');
    }
  },
}));
