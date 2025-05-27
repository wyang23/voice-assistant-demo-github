'use client';

import React from 'react';
import { ThemeProvider, createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Extend the theme to include custom properties
declare module '@mui/material/styles' {
  interface Palette {
    lighter?: string;
  }
  
  interface PaletteColor {
    lighter?: string;
  }
}

// Create a custom theme
const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
      lighter: '#e3f2fd'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20'
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    }
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem'
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem'
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 500
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 500
    },
    body1: {
      fontSize: '1rem'
    },
    body2: {
      fontSize: '0.875rem'
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px'
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px 8px'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12
        },
        elevation1: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  }
};

const theme = createTheme(themeOptions);

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}