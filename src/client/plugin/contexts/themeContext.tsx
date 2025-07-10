import { createContext } from 'react';
import { ColorTheme } from '../../lib/types';

interface ThemeContextType {
  currentTheme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  predefinedThemes: ColorTheme[];
}

const themeContext = createContext<ThemeContextType | undefined>(undefined);

export default themeContext;
