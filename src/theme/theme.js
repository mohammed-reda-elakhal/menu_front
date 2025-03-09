import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3768e5',
      light: '#757de8',
      dark: '#2855c7',
    },
    secondary: {
      main: '#01021b',
      light: '#1a1b34',
      dark: '#000112',
    },
    background: {
      default: '#01021b',
      paper: '#0a0b24',
    },
    text: {
      primary: '#e7e7e7',
      secondary: '#333333',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#01021b',
          borderRight: '1px solid rgba(55, 104, 229, 0.2)',
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          margin: '4px 8px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'rgba(55, 104, 229, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(55, 104, 229, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(55, 104, 229, 0.24)',
            },
          },
        },
      },
    },
  },
});

export default theme;
