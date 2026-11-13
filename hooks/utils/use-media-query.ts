"use client";

/**
 * Media Query Hooks
 * Responsive design utilities
 */

import { useCallback, useSyncExternalStore } from "react";

const subscribeToQuery = (query: string, onChange: () => void) => {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

const getQuerySnapshot = (query: string) => {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
};

/**
 * Hook to check if a media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => subscribeToQuery(query, onChange),
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => getQuerySnapshot(query),
    () => false,
  );
};

/**
 * Predefined breakpoint hooks
 */
export const useIsMobile = () => useMediaQuery("(max-width: 639px)");
export const useIsTablet = () =>
  useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsLargeDesktop = () => useMediaQuery("(min-width: 1280px)");

/**
 * Hook for preferred color scheme
 */
export const usePrefersDarkMode = () =>
  useMediaQuery("(prefers-color-scheme: dark)");

/**
 * Hook for reduced motion preference
 */
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/**
 * Hook that returns current breakpoint
 */
export const useBreakpoint = (): "mobile" | "tablet" | "desktop" | "large" => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isLargeDesktop = useIsLargeDesktop();

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  if (isLargeDesktop) return "large";
  return "desktop";
};
