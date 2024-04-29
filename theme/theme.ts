'use client';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Base styles
import { Colors } from './base/colors';
import { Typography } from './base/typography';

let theme = createTheme({
  palette: { ...Colors },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: { ...Typography },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          ...Typography.buttonX,
          backgroundColor: '#373737',
          padding: '6px 10px',
          '&:hover': {
            backgroundColor: '#414141',
          },
          '@media(min-width: 600px)': {
            ...Typography.buttonS,
          },
          '@media(min-width: 900px)': {
            ...Typography.buttonMSB,
          },
          '@media(min-width: 1200px)': {
            ...Typography.buttonLSB,
            padding: '8px 14px'
          },
          '@media(min-width: 1536px)': {
            ...Typography.buttonLSB,
            padding: '10px 14px'
          },
        },
        outlined: {
          ...Typography.buttonX,
          padding: '6px 10px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          backgroundColor: '#000000',
          '&:hover': {
            backgroundColor: '#414141',
          },
          '@media(min-width: 600px)': {
            ...Typography.buttonS,
          },
          '@media(min-width: 900px)': {
            ...Typography.buttonMSB,
          },
          '@media(min-width: 1200px)': {
            ...Typography.buttonLSB,
            padding: '8px 14px'
          },
          '@media(min-width: 1536px)': {
            ...Typography.buttonLSB,
            padding: '10px 14px'
          },
        },
      }
    }
  }
  // components: {
  //   MuiGrid: {
  //     defaultProps: {
  //       sx: {
  //         width: 'initial',
  //         margin: 0
  //       }
  //     },
  //     styleOverrides: {
  //       root: {
  //         width: 'initial',
  //         margin: 0
  //       }
  //     }
  //   }
  // }
  //   MuiButton: {
  //     variants: [
  //       {
  //         props: { variant: 'quiet' },
  //         style: {
  //           color: 'white'
  //         }
  //       }
  //     ]
  //   }
});

theme = responsiveFontSizes(theme);

export default theme;
