import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('filesafe-theme');
      return (saved as Theme) || 'light';
    } catch (error) {
      // Fallback if localStorage is unavailable (private browsing, etc.)
      return 'light';
    }
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('filesafe-theme', theme);
    } catch (error) {
      // Silent fail if localStorage is unavailable
      // Theme will still work for current session
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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
