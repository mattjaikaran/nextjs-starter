'use client';

import type { AppConfig } from '@/config';
import { config as defaultConfig } from '@/config';
import { create } from 'zustand';

export interface ConfigSlice {
  config: AppConfig;
  isDjangoSPA: boolean;
  isStandalone: boolean;
  sidebarOpen: boolean;
  updateConfig: (updates: Partial<AppConfig>) => void;
  isFeatureEnabled: (feature: keyof AppConfig['features']) => boolean;
  setFeature: (feature: keyof AppConfig['features'], enabled: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useConfigStore = create<ConfigSlice>((set, get) => ({
  config: defaultConfig,
  isDjangoSPA: defaultConfig.env.mode === 'django-spa',
  isStandalone: defaultConfig.env.mode === 'standalone',
  sidebarOpen: true,

  updateConfig: (updates) => {
    const { config } = get();
    const newConfig = { ...config, ...updates };
    set({
      config: newConfig,
      isDjangoSPA: newConfig.env.mode === 'django-spa',
      isStandalone: newConfig.env.mode === 'standalone',
    });
  },

  isFeatureEnabled: (feature) => {
    const { config } = get();
    return config.features[feature];
  },

  setFeature: (feature, enabled) => {
    const { config, updateConfig } = get();
    updateConfig({
      features: { ...config.features, [feature]: enabled },
    });
  },

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => {
    const { sidebarOpen } = get();
    set({ sidebarOpen: !sidebarOpen });
  },
}));
