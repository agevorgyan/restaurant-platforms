import React, { createContext, useContext, useEffect, useState } from 'react';
import { RestaurantTheme } from '../types';
import { generateThemeCss } from '../utils/css-generator';
import { defaultTheme } from '../default-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: RestaurantTheme;
  defaultMode?: 'light' | 'dark' | 'system';
}

interface ThemeContextType {
  theme: RestaurantTheme;
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = defaultTheme,
  defaultMode = 'system',
}) => {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(defaultMode);

  useEffect(() => {
    // Inject the CSS variables into the head
    const styleId = `theme-css-${theme.id}`;
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    
    styleTag.innerHTML = generateThemeCss(theme);
    
    return () => {
      if (styleTag && styleTag.parentNode) {
        styleTag.parentNode.removeChild(styleTag);
      }
    };
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
