// Dynamic Color Palettes for BusinessProfile Component
// Each palette contains light and dark mode variations with proper contrast ratios

export const colorPalettes = {
  // Default Blue Theme (existing theme)
  default: {
    name: 'Ocean Blue',
    description: 'Professional blue theme with excellent readability',
    light: {
      primary: '#3768e5',
      primaryHover: '#2855c7',
      primaryLight: '#6e8fec',
      secondary: '#757de8',
      accent: '#d97706', // amber-600
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
      accent: '#fbbf24', // amber-400
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
  },

  // Warm Sunset Theme
  sunset: {
    name: 'Warm Sunset',
    description: 'Warm orange and red tones for cozy, inviting atmosphere',
    light: {
      primary: '#ea580c',
      primaryHover: '#c2410c',
      primaryLight: '#fb923c',
      secondary: '#f97316',
      accent: '#dc2626',
      accentHover: '#b91c1c',
      background: '#fef7f0',
      backgroundSecondary: '#ffffff',
      backgroundTertiary: '#fed7aa',
      text: '#1f2937',
      textSecondary: '#4b5563',
      textMuted: '#6b7280',
      border: '#fed7aa',
      borderHover: '#fdba74',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    dark: {
      primary: '#fb923c',
      primaryHover: '#f97316',
      primaryLight: '#fdba74',
      secondary: '#f97316',
      accent: '#f87171',
      accentHover: '#ef4444',
      background: '#1c1917',
      backgroundSecondary: '#292524',
      backgroundTertiary: '#44403c',
      text: '#fef7f0',
      textSecondary: '#e7e5e4',
      textMuted: '#a8a29e',
      border: '#44403c',
      borderHover: '#57534e',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    }
  },

  // Forest Green Theme
  forest: {
    name: 'Forest Green',
    description: 'Natural green tones for eco-friendly and organic businesses',
    light: {
      primary: '#059669',
      primaryHover: '#047857',
      primaryLight: '#34d399',
      secondary: '#10b981',
      accent: '#7c3aed',
      accentHover: '#6d28d9',
      background: '#f0fdf4',
      backgroundSecondary: '#ffffff',
      backgroundTertiary: '#dcfce7',
      text: '#1f2937',
      textSecondary: '#4b5563',
      textMuted: '#6b7280',
      border: '#bbf7d0',
      borderHover: '#86efac',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    dark: {
      primary: '#34d399',
      primaryHover: '#10b981',
      primaryLight: '#6ee7b7',
      secondary: '#10b981',
      accent: '#a78bfa',
      accentHover: '#8b5cf6',
      background: '#0f1419',
      backgroundSecondary: '#1a202c',
      backgroundTertiary: '#2d3748',
      text: '#f0fdf4',
      textSecondary: '#e2e8f0',
      textMuted: '#a0aec0',
      border: '#2d3748',
      borderHover: '#4a5568',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    }
  },

  // Purple Luxury Theme
  luxury: {
    name: 'Royal Purple',
    description: 'Elegant purple theme for premium and luxury businesses',
    light: {
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      primaryLight: '#a78bfa',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      accentHover: '#d97706',
      background: '#faf5ff',
      backgroundSecondary: '#ffffff',
      backgroundTertiary: '#e9d5ff',
      text: '#1f2937',
      textSecondary: '#4b5563',
      textMuted: '#6b7280',
      border: '#ddd6fe',
      borderHover: '#c4b5fd',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    dark: {
      primary: '#a78bfa',
      primaryHover: '#8b5cf6',
      primaryLight: '#c4b5fd',
      secondary: '#8b5cf6',
      accent: '#fbbf24',
      accentHover: '#f59e0b',
      background: '#1e1b4b',
      backgroundSecondary: '#312e81',
      backgroundTertiary: '#4c1d95',
      text: '#faf5ff',
      textSecondary: '#e0e7ff',
      textMuted: '#a5b4fc',
      border: '#4c1d95',
      borderHover: '#5b21b6',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    }
  },

  // Rose Gold Theme
  rose: {
    name: 'Rose Gold',
    description: 'Elegant rose and pink tones for beauty and lifestyle brands',
    light: {
      primary: '#e11d48',
      primaryHover: '#be185d',
      primaryLight: '#f43f5e',
      secondary: '#ec4899',
      accent: '#0891b2',
      accentHover: '#0e7490',
      background: '#fdf2f8',
      backgroundSecondary: '#ffffff',
      backgroundTertiary: '#fce7f3',
      text: '#1f2937',
      textSecondary: '#4b5563',
      textMuted: '#6b7280',
      border: '#f9a8d4',
      borderHover: '#f472b6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    dark: {
      primary: '#f472b6',
      primaryHover: '#ec4899',
      primaryLight: '#f9a8d4',
      secondary: '#ec4899',
      accent: '#22d3ee',
      accentHover: '#06b6d4',
      background: '#1f1726',
      backgroundSecondary: '#2d1b3d',
      backgroundTertiary: '#4a1e4a',
      text: '#fdf2f8',
      textSecondary: '#f3e8ff',
      textMuted: '#d8b4fe',
      border: '#4a1e4a',
      borderHover: '#5b2c6f',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    }
  },

  // Monochrome Theme
  monochrome: {
    name: 'Monochrome',
    description: 'Clean black and white theme for minimalist design',
    light: {
      primary: '#1f2937',
      primaryHover: '#111827',
      primaryLight: '#374151',
      secondary: '#4b5563',
      accent: '#6b7280',
      accentHover: '#4b5563',
      background: '#ffffff',
      backgroundSecondary: '#f9fafb',
      backgroundTertiary: '#f3f4f6',
      text: '#111827',
      textSecondary: '#374151',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      borderHover: '#d1d5db',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    dark: {
      primary: '#f9fafb',
      primaryHover: '#f3f4f6',
      primaryLight: '#e5e7eb',
      secondary: '#d1d5db',
      accent: '#9ca3af',
      accentHover: '#d1d5db',
      background: '#000000',
      backgroundSecondary: '#111827',
      backgroundTertiary: '#1f2937',
      text: '#ffffff',
      textSecondary: '#f9fafb',
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

// Helper function to get palette names for UI
export const getPaletteNames = () => {
  return Object.keys(colorPalettes);
};

// Helper function to get palette info
export const getPaletteInfo = (paletteKey) => {
  const palette = colorPalettes[paletteKey];
  return palette ? {
    name: palette.name,
    description: palette.description
  } : null;
};
