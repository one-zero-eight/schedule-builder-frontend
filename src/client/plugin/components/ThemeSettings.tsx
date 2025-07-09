import { useState } from 'react';
import useTheme from '../hooks/useTheme';
import { ColorTheme } from '../../lib/types';

export default function ThemeSettings() {
  const {
    currentTheme,
    setTheme,
    predefinedThemes,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useTheme();
  const [customTheme, setCustomTheme] = useState<ColorTheme>(currentTheme);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleThemeSelect = (theme: ColorTheme) => {
    setTheme(theme);
    setCustomTheme(theme);
    setIsCustomizing(false);
  };

  const handleCustomThemeChange = (
    colorKey: keyof ColorTheme['colors'],
    value: string
  ) => {
    const updatedTheme = {
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [colorKey]: value,
      },
    };
    setCustomTheme(updatedTheme);
    setTheme(updatedTheme);
  };

  const handleSaveCustomTheme = () => {
    const savedTheme = {
      ...customTheme,
      id: 'custom',
      name: 'Custom Theme',
    };
    setTheme(savedTheme);
    setIsCustomizing(false);
  };

  const handleReset = () => {
    setCustomTheme(currentTheme);
    setIsCustomizing(false);
  };

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text">Theme Settings</h2>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="text-textSecondary hover:text-text transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Предустановленные темы */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-text mb-3">
            Predefined Themes
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {predefinedThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  currentTheme.id === theme.id
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-border hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span className="text-sm font-medium text-text">
                    {theme.name}
                  </span>
                </div>
                <div className="flex gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Кастомизация */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-text">Custom Theme</h3>
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="text-sm text-primary hover:text-secondary transition-colors"
            >
              {isCustomizing ? 'Cancel' : 'Customize'}
            </button>
          </div>

          {isCustomizing && (
            <div className="space-y-3">
              {Object.entries(customTheme.colors).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <label className="text-sm text-textSecondary w-20 capitalize">
                    {key}:
                  </label>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) =>
                      handleCustomThemeChange(
                        key as keyof ColorTheme['colors'],
                        e.target.value
                      )
                    }
                    className="w-8 h-8 rounded border border-border"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleCustomThemeChange(
                        key as keyof ColorTheme['colors'],
                        e.target.value
                      )
                    }
                    className="flex-1 px-2 py-1 text-sm bg-surface border border-border rounded text-text"
                    placeholder="#000000"
                  />
                </div>
              ))}

              <div className="flex gap-2 pt-3">
                <button
                  onClick={handleSaveCustomTheme}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
                >
                  Save Custom Theme
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-surface border border-border text-text rounded hover:bg-accent transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Предварительный просмотр */}
        <div className="border-t border-border pt-4">
          <h3 className="text-lg font-medium text-text mb-3">Preview</h3>
          <div className="space-y-2">
            <div className="p-3 rounded bg-surface border border-border">
              <p className="text-text font-medium">Sample Text</p>
              <p className="text-textSecondary text-sm">Secondary text</p>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1 bg-primary text-white rounded text-sm">
                  Primary Button
                </button>
                <button className="px-3 py-1 bg-surface border border-border text-text rounded text-sm">
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
