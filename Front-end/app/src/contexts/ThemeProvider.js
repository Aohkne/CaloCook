import React, { createContext, useContext, useState } from 'react';
import { getColors } from '@styles/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    console.log('Theme:', !isDark ? 'Dark Mode' : 'Light Mode');
    setIsDark(!isDark);
  };

  const currentTheme = getColors(isDark);

  const themeValue = {
    isDark,
    toggleTheme,
    colors: currentTheme
  };

  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng trong ThemeProvider');
  }
  return context;
};
