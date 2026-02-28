'use client';

import { config } from '@/config';
import { useAuthStore } from './slices/authSlice';
import { useConfigStore } from './slices/configSlice';
import { useTodoStore } from './slices/todoSlice';
import { useUIStore } from './slices/uiSlice';

export { useAuthStore } from './slices/authSlice';
export { useConfigStore } from './slices/configSlice';
export { useTodoStore } from './slices/todoSlice';
export { useUIStore } from './slices/uiSlice';

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    tokens: store.tokens,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    setUser: store.setUser,
    setTokens: store.setTokens,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
    initializeAuth: store.initializeAuth,
  };
};

export const useUI = () => useUIStore();
export const useTodos = () => useTodoStore();

export const useAppConfig = () => ({
  config: useConfigStore((s) => s.config),
  isDjangoSPA: useConfigStore((s) => s.isDjangoSPA),
  isStandalone: useConfigStore((s) => s.isStandalone),
  updateConfig: useConfigStore((s) => s.updateConfig),
  isFeatureEnabled: useConfigStore((s) => s.isFeatureEnabled),
  setFeature: useConfigStore((s) => s.setFeature),
});

export const useFeatureEnabled = (feature: keyof typeof config.features) =>
  config.features[feature];

export const useApiConfig = () => config.api;
export const useAuthConfig = () => config.auth;
export const useDjangoConfig = () => config.django;
export const useEnvConfig = () => config.env;
export const useIsDjangoSPA = () => config.env.mode === 'django-spa';
export const useIsStandalone = () => config.env.mode === 'standalone';

export const useTheme = () => {
  // For Next.js, theme is managed by next-themes, not Zustand
  // Import useTheme from next-themes directly when needed
  return 'system' as const;
};

export const useSetTheme = () => {
  // Use next-themes setTheme directly
  return (_theme: string) => {};
};

export const useToggleTheme = () => {
  return () => {};
};
