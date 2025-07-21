'use client';
import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from '../context/theme';

const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined || context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};



export default useTheme;
