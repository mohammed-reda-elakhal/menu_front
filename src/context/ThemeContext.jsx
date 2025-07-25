import { createContext, useContext, useState, useEffect } from 'react';

// Fallback color palettes in case import fails
const defaultColorPalettes = {
  default: {
    name: 'Ocean Blue',
    description: 'Professional blue theme with excellent readability',
    light: {
      primary: '#3768e5',
      primaryHover: '#2855c7',
      primaryLight: '#6e8fec',
      secondary: '#757de8',
      accent: '#d97706',
      accentHover: '#b45309',
      background: '#f9fafb',
      backgroundSecondary: '#ffffff',
      backgroundTertiary: '#f3f4f6',
      text: '#1f2937',
      textSecondary: '#4b5563',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      borderHover: '#d1d5db',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    dark: {
      primary: '#818cf8',
      primaryHover: '#6366f1',
      primaryLight: '#a5b4fc',
      secondary: '#6366f1',
      accent: '#fbbf24',
      accentHover: '#f59e0b',
      background: '#111827',
      backgroundSecondary: '#1f2937',
      backgroundTertiary: '#374151',
      text: '#f9fafb',
      textSecondary: '#e5e7eb',
      textMuted: '#9ca3af',
      border: '#374151',
      borderHover: '#4b5563',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    }
  }
};

// Use default color palettes for now
const colorPalettes = defaultColorPalettes;

const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  colorPalette: 'default',
  setColorPalette: () => {},
  currentColors: {},
});

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = () => {
    // Check if there's a saved preference in localStorage
    const savedTheme = localStorage.getItem('darkMode');

    // If there's a saved preference, use it
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }

    // Otherwise, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Initialize color palette from localStorage
  const getInitialColorPalette = () => {
    const savedPalette = localStorage.getItem('colorPalette');
    return savedPalette && colorPalettes[savedPalette] ? savedPalette : 'default';
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme());
  const [colorPalette, setColorPaletteState] = useState(getInitialColorPalette());

  // Get current colors based on dark mode and color palette
  const getCurrentColors = () => {
    const palette = colorPalettes[colorPalette];
    return darkMode ? palette.dark : palette.light;
  };



  // Update localStorage and document class when theme changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update localStorage and CSS custom properties when color palette changes
  useEffect(() => {
    localStorage.setItem('colorPalette', colorPalette);

    // Apply CSS custom properties for dynamic theming
    const colors = getCurrentColors();
    const root = document.documentElement;

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [colorPalette, darkMode]);

  // Listen for system preference changes
  useEffect(() => {
    // Only apply system preference changes if there's no saved preference
    if (localStorage.getItem('darkMode') === null) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e) => {
        setDarkMode(e.matches);
      };

      // Add listener for system preference changes
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }

      // Cleanup
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          // Fallback for older browsers
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const setColorPalette = (paletteKey) => {
    if (colorPalettes[paletteKey]) {
      setColorPaletteState(paletteKey);
    }
  };

  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleDarkMode,
      colorPalette,
      setColorPalette,
      currentColors: getCurrentColors()
    }}>
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
