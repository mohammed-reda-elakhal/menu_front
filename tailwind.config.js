/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'dancing-script': ['"Dancing Script"', 'cursive'],
        'lobster': ['"Lobster"', 'cursive'],
        'merriweather': ['"Merriweather"', 'serif'],
        'playfair': ['"Playfair Display"', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'ui-sans': ['ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#3768e5',
        primary2:'rgb(198, 214, 252)',
        secondary1: '#01021b',
        secondary2: '#757de8',
        gray_bg: '#e7e7e7',
        gray_text: '#333333',

        // Light mode colors
        'light': {
          'bg': '#e5e7eb',
          'card': '#ffffff',
          'card-hover': '#e2e8f0',
          'border': '#d1d5db',
          'text': '#1e293b',
          'text-secondary': '#64748b',
          'text-muted': '#94a3b8',
        },

        // Dark mode colors
        'dark': {
          'bg': '#0f172a',
          'card': '#1e293b',
          'card-hover': '#334155',
          'border': '#334155',
          'text': '#f1f5f9',
          'text-secondary': '#cbd5e1',
          'text-muted': '#94a3b8',
        },

        'coffee-darkest': '#2D1E16',
        'coffee-dark': '#5C3A21',
        'coffee-medium': '#A58F7D',
        'coffee-light': '#D7CCC8',
        'coffee-paper': '#F9F5EF',
        'coffee-bean-pattern': '#A1887F',

        /* Minimal-Breeze palette */
        'mb-bg': '#fafafa',
        'mb-surface': '#ffffff',
        'mb-text': '#1a1a1a',
        'mb-muted': '#6b7280',
        'mb-accent': '#059669',
        'mb-border': '#e5e7eb',

        /* Glass-Frost */
        'gf-bg': '#eef2ff',
        'gf-surface': 'rgba(255,255,255,0.14)',
        'gf-border': 'rgba(255,255,255,0.28)',
        'gf-text': '#f8fafc',
        'gf-muted': '#cbd5e1',
        'gf-accent': '#3b82f6',

        'glass': 'rgba(255,255,255,0.18)',
        'glass-dark': 'rgba(30,41,59,0.32)',
        'glass-border': 'rgba(255,255,255,0.28)',
        'wood-bg': '#E7D3B3',
        'wood-dark': '#8B6A45',
        'wood-text': '#2B2215',
        'wood-accent': '#C27A00',
        'wood-surface': 'rgba(255,255,255,0.10)',
        'minimalist-bg': '#FFFEDE',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
      },
      backgroundImage: {
        'header-gradient': 'linear-gradient(150deg, rgba(1,2,27,0.99), rgba(55,104,229,0.85))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 100%)',
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'ping-once': 'ping 0.5s cubic-bezier(0, 0, 0.2, 1) 1',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        ping: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2)', opacity: '0' }
        }
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d'
      },
      perspective: {
        'none': 'none',
        '500': '500px',
        '1000': '1000px',
        '2000': '2000px',
      },
      screens: {
        'xs': '480px',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-dark': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'card-hover-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'glass': '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      scale: {
        '102': '1.02',
      },
      lineClamp: {
        '1': '1',
        '2': '2',
        '3': '3',
      }
    },
  },
  plugins: [
    // Line clamp plugin
    function({ addUtilities }) {
      const newUtilities = {
        '.line-clamp-1': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
          overflow: 'hidden',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
          overflow: 'hidden',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
          overflow: 'hidden',
        },
      }
      addUtilities(newUtilities)
    },
    // Add custom backdrop filter utilities
    function({ addUtilities }) {
      const backdropUtilities = {
        '.backdrop-blur-xs': {
          'backdrop-filter': 'blur(2px)',
        },
        '.backdrop-blur-sm': {
          'backdrop-filter': 'blur(4px)',
        },
        '.backdrop-blur-md': {
          'backdrop-filter': 'blur(8px)',
        },
        '.backdrop-blur-lg': {
          'backdrop-filter': 'blur(16px)',
        },
        '.backdrop-blur-xl': {
          'backdrop-filter': 'blur(24px)',
        },
        '.backdrop-blur-2xl': {
          'backdrop-filter': 'blur(40px)',
        },
      }
      addUtilities(backdropUtilities)
    },
    // Add transform style utilities
    function({ addUtilities }) {
      const transformUtilities = {
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
      }
      addUtilities(transformUtilities)
    },
  ],
}