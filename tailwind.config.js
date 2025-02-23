/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3768e5',   // Your primary color
        secondary1: '#01021b', // Your secondary color
        secondary2: '#757de8', // Your secondary color
        white: '#ffffff',     // White (default but explicitly declared)
        gray_bg: '#e7e7e7',      // Gray color for your design
        gray_text: '#333333',      // Gray color for your design

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
