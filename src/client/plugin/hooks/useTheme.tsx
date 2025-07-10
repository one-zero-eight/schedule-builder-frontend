import { useContext } from 'react';
import themeContext from '../contexts/themeContext';

export default function useTheme() {
  const context = useContext(themeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
