'use client';

import { createContext, use, useState, useEffect, useCallback } from 'react';
import { persistThemeClient, type Theme } from '@/lib/prefs';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({
  children,
  initialTheme = 'dark',
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    setThemeState(initialTheme);
    persistThemeClient(initialTheme);
  }, [initialTheme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    persistThemeClient(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return use(ThemeContext);
}
