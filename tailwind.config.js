/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3768e5',
        secondary1: '#01021b',
        secondary2: '#757de8',
        gray_bg: '#e7e7e7',
        gray_text: '#333333',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      animation: {
        gradient: 'gradient 8s ease infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite'
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d'
      },
      perspective: {
        '1000': '1000px'
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}

/*
 Color palette reference:
 - Primary:   #3768e5
 - Secondary 1: #01021b
 - Secondary 2 : #757de8
 - White:     #ffffff
 - Gray 1 :      #e7e7e7
 - Gray 2 : #333333

 Palette generated with Coolors: https://coolors.co/3768e5-01021b-757de8-ffffff-e7e7e7-333333
*/
