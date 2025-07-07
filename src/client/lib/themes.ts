import { ColorTheme } from './types';

export const predefinedThemes: ColorTheme[] = [
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#8C35F6',
      secondary: '#5C20A6',
      accent: '#323232',
      background: '#1a1a1a',
      surface: '#282828',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      border: '#404040',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
    },
  },
  {
    id: 'light',
    name: 'Light Mode',
    colors: {
      primary: '#8C35F6',
      secondary: '#5C20A6',
      accent: '#f3f4f6',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#d1d5db',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#d97706',
    },
  },
  {
    id: 'blue',
    name: 'Blue Theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#1e3a8a',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: '#334155',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
    },
  },
  {
    id: 'green',
    name: 'Green Theme',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#064e3b',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: '#334155',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
    },
  },
  {
    id: 'purple',
    name: 'Purple Theme',
    colors: {
      primary: '#a855f7',
      secondary: '#7c3aed',
      accent: '#581c87',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: '#334155',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
    },
  },
];

export const defaultTheme = predefinedThemes[0]; // Dark Mode

export function getThemeById(id: string): ColorTheme {
  return predefinedThemes.find(theme => theme.id === id) || defaultTheme;
}

export function saveThemeToStorage(theme: ColorTheme): void {
  try {
    localStorage.setItem('selectedTheme', JSON.stringify(theme));
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
}

export function getThemeFromStorage(): ColorTheme {
  try {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      // Проверяем, что сохраненная тема валидна
      if (parsed.id && parsed.colors) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
  }
  return defaultTheme;
} 