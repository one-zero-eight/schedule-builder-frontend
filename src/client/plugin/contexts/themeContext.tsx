import { createContext } from 'react';
import { ColorTheme } from '../../lib/types';

interface ThemeContextType {
  currentTheme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  predefinedThemes: ColorTheme[];
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const themeContext = createContext<ThemeContextType | undefined>(undefined);

export default themeContext;
