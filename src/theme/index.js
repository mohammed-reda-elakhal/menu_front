import { createTheme } from '@mui/material/styles'

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3768e5',
    },
    secondary: {
      main: '#757de8',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3768e5',
    },
    secondary: {
      main: '#757de8',
    },
    background: {
      default: '#01021b',
      paper: '#0a0c2c',
    },
    text: {
      primary: '#e7e7e7',
      secondary: '#a0aec0',
    },
  },
})