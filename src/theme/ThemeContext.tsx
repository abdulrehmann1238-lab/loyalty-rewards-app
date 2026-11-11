import React, { createContext, useContext } from 'react';
import { AppThemeColors, DarkColors, LightColors } from './tokens';
import { useUserStore } from '@/store/userStore';

interface ThemeContextValue {
  colors: AppThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: LightColors,
  isDark: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useUserStore((s) => s.preferences.themeMode);
  const updatePreferences = useUserStore((s) => s.updatePreferences);

  const isDark = themeMode === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  const toggleTheme = () => {
    updatePreferences({ themeMode: isDark ? 'light' : 'dark' });
  };

  const setThemeMode = (mode: 'light' | 'dark') => {
    updatePreferences({ themeMode: mode });
  };

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

