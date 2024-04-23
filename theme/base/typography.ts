import { TypographyOptions } from '@mui/material/styles/createTypography';

const baseProperties = {
  fontFamily: '"Inter", sans-serif',
  fontFamily2: '"Merriweather", sans-serif',
  fontWeightLighter: 200,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  fontWeightExtraBold: 900,
};

export const Typography: TypographyOptions = {
  fontFamily: baseProperties.fontFamily,
  fontWeightLight: baseProperties.fontWeightLight,
  fontWeightRegular: baseProperties.fontWeightRegular,
  fontWeightMedium: baseProperties.fontWeightMedium,
  fontWeightBold: baseProperties.fontWeightBold,

  h1: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '3.75rem',
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },

  h2: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '3.375rem',
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },

  h3: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightLighter,
    fontSize: '3.5rem',
    lineHeight: 1.167,
    letterSpacing: '0em',
  },

  h4: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightLighter,
    fontSize: '3.375rem',
    lineHeight: 1.235,
    letterSpacing: '0.00935em',
  },

  h5: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '1.5rem',
    lineHeight: 1.334,
    letterSpacing: '0em',
  },

  h6: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '1.25rem',
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
  },

  subtitle1: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '24px',
    lineHeight: 1.75,
    letterSpacing: '0.00938em',
  },

  subtitle2: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '16px',
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },

  body1: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '1rem',
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },

  body2: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '13px',
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },

  button: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightMedium,
    fontSize: '14px',
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
  },

  caption: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '10px',
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
};
