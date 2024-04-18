import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Base styles
import { Colors } from './base/colors';
// import { Typography } from './base/typography';

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
  // typography: { ...Typography },
});

theme = responsiveFontSizes(theme);

export default theme;
