import { useState, useEffect, ReactNode } from 'react';
import { ColorTheme } from '../../lib/types';
import {
  getThemeFromStorage,
  saveThemeToStorage,
  predefinedThemes,
} from '../../lib/themes';
import { ThemeContext } from '../contexts/themeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(
    getThemeFromStorage()
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const setTheme = (theme: ColorTheme) => {
    setCurrentTheme(theme);
    saveThemeToStorage(theme);

    // Применяем CSS переменные к документу
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Применяем CSS переменные для иконок
    const iconColors = {
      'icon-primary': theme.colors.textSecondary || '#a0a0a0',
      'icon-hover': theme.colors.text || '#ffffff',
      'icon-ignore': '#ef4444',
      'icon-ignore-hover': '#fca5a5',
      'icon-restore': '#22c55e',
      'icon-restore-hover': '#86efac',
    };

    Object.entries(iconColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Применяем класс темы к body
    const { body } = document;
    body.className = body.className.replace(/theme-\w+/g, ''); // Удаляем старые классы тем
    body.classList.add(`theme-${theme.id}`);

    // Добавляем специальный класс для светлой темы
    if (theme.id === 'light') {
      body.classList.add('light-mode');
    } else {
      body.classList.remove('light-mode');
    }
  };

  useEffect(() => {
    // Применяем тему при инициализации
    setTheme(currentTheme);

    // I don't understand why do we need to set the theme on mount here?
    // Leaving this here until we can discuss it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        predefinedThemes,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
