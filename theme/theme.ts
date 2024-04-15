import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Base styles
import { Colors } from './base/colors';
import { Typography } from './base/typography';

let theme = createTheme({
  palette: { ...Colors },
  typography: { ...Typography },
});

theme = responsiveFontSizes(theme);

export default theme;
