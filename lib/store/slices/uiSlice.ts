'use client';

import { generateId } from '@/lib/utils';
import type { Notification, Theme, UIState } from '@/types';
import { create } from 'zustand';

export interface UISlice extends UIState {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UISlice>((set, get) => ({
  theme: 'system',
  sidebarOpen: false,
  notifications: [],

  setTheme: (theme) => set({ theme }),
  toggleTheme: () => {
    const { theme } = get();
    set({ theme: theme === 'light' ? 'dark' : 'light' });
  },

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => {
    const { sidebarOpen } = get();
    set({ sidebarOpen: !sidebarOpen });
  },

  addNotification: (notificationData) => {
    const { notifications } = get();
    const notification: Notification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    set({ notifications: [notification, ...notifications] });

    const duration = notification.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(notification.id);
      }, duration);
    }
  },

  removeNotification: (id) => {
    const { notifications } = get();
    set({ notifications: notifications.filter((n) => n.id !== id) });
  },

  clearNotifications: () => set({ notifications: [] }),
}));
