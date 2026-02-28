'use client';

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const storage = getStorage();
    if (!storage) return defaultValue;
    const item = storage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    const storage = getStorage();
    if (storage) {
      storage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore storage errors
  }
}

export function removeStorageItem(key: string): void {
  try {
    const storage = getStorage();
    if (storage) {
      storage.removeItem(key);
    }
  } catch {
    // Ignore storage errors
  }
}
