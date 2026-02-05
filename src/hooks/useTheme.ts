'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const STORAGE_KEY = 'code-tutor-theme';

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);

    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setThemeState(stored);
      applyTheme(stored);
      return;
    }

    // Fall back to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme: Theme = prefersDark ? 'dark' : 'light';
    setThemeState(systemTheme);
    applyTheme(systemTheme);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if no stored preference
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Prevent hydration mismatch by returning light theme until mounted
  if (!mounted) {
    return {
      theme: 'light',
      toggleTheme: () => {},
      setTheme: () => {},
      isDark: false,
    };
  }

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
  };
}
