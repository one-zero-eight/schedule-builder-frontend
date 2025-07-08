import { createContext, useContext } from 'react';
import { ColorTheme } from '../../lib/types';

interface ThemeContextType {
  currentTheme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  predefinedThemes: ColorTheme[];
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
