import { TypographyOptions } from '@mui/material/styles/createTypography';

const baseProperties = {
  fontFamily: '"Inter", sans-serif',
  fontFamily2: '"Restora", "Nunito Sans", sans-serif',
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
    fontWeight: baseProperties.fontWeightLighter,
    fontSize: '4.6875rem',
    lineHeight: 1.167,
    letterSpacing: '-0.01562em',
  },

  h2: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightLighter,
    fontSize: '4.35025rem',
    lineHeight: 1.2,
    letterSpacing: '-0.00833em',
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
    fontSize: '3rem',
    lineHeight: 1.235,
    letterSpacing: '0.00935em',
  },

  h5: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightExtraBold,
    fontSize: '2.5rem',
    lineHeight: 1.334,
    letterSpacing: '0em',
  },

  h6: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightExtraBold,
    fontSize: '2rem',
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
  },

  subtitle1: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '1.5rem',
    lineHeight: 1.75,
    letterSpacing: '0.00938em',
  },

  subtitle2: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightMedium,
    fontSize: '0.875rem',
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
    fontSize: '0.875rem',
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },

  button: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightMedium,
    fontSize: '0.875rem',
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
  },

  caption: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '0.75rem',
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
};
