import { TypographyOptions } from '@mui/material/styles/createTypography';

const baseProperties = {
  fontFamily: '"Inter", sans-serif',
  fontWeightLighter: 200,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  fontWeightExtraBold: 800,
};

export const Typography: TypographyOptions = {
  fontFamily: baseProperties.fontFamily,
  fontWeightLight: baseProperties.fontWeightLight,
  fontWeightRegular: baseProperties.fontWeightRegular,
  fontWeightMedium: baseProperties.fontWeightMedium,
  fontWeightBold: baseProperties.fontWeightBold,

  hB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightExtraBold,
    fontSize: '61px',
    lineHeight: 1.5,
    letterSpacing: '-0.04em',
    textAlign: 'left',
  },

  h1: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '49px',
    lineHeight: 1.3,
    letterSpacing: '-0.04em',
    textAlign: 'left',
  },

  h2: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightExtraBold,
    fontSize: '40px',
    lineHeight: 3.026,
    letterSpacing: '0.00938em',
    textAlign: 'left',
  },

  h3: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '31px',
    lineHeight: 2.325,
    letterSpacing: '0em',
    textAlign: 'left',
  },

  h4: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '24px',
    lineHeight: 1.8,
    letterSpacing: '0.00935em',
    textAlign: 'left',
  },

  h5: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '1.5rem',
    lineHeight: 1.334,
    letterSpacing: '0em',
    textAlign: 'left',
  },

  h6: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '1.25rem',
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
    textAlign: 'left',
  },

  subtitleLB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '25px',
    lineHeight: 1.875,
    letterSpacing: '0.0075em',
    textAlign: 'left',
  },

  subtitleL: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightMedium,
    fontSize: '25px',
    lineHeight: 1.875,
    letterSpacing: '0.0075em',
    textAlign: 'left',
  },

  subtitleMB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '20px',
    lineHeight: 1.5,
    letterSpacing: '0.0075em',
    textAlign: 'left',
  },

  subtitleM: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '20px',
    lineHeight: 1.5,
    letterSpacing: '0.0075em',
    textAlign: 'left',
  },

  subtitleSB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '18px',
    lineHeight: 1.35,
    letterSpacing: '0.0075em',
    textAlign: 'left',
  },

  subtitleS: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: 1.35,
    letterSpacing: '0.0075em',
    textAlign: 'left',
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

  bodyBB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '16px',
    lineHeight: 1.2,
    letterSpacing: '0.00938em',
  },

  bodyB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '16px',
    lineHeight: 1.6,
    letterSpacing: '0.00938em',
  },

  bodyMB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '14px',
    lineHeight: 1.4,
    letterSpacing: '0.00938em',
  },

  bodyM: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '14px',
    lineHeight: 1.4,
    letterSpacing: '0.00938em',
  },

  bodySB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '13px',
    lineHeight: 0.975,
    letterSpacing: '0.00938em',
  },

  bodyS: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightMedium,
    fontSize: '13px',
    lineHeight: 1.138,
    letterSpacing: '0.00938em',
  },

  bodyX: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '10px',
    lineHeight: 0.75,
    letterSpacing: '0.02em',
  },

  body1: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '1rem',
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },

  body2: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '13px',
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },

  buttonLB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightBold,
    fontSize: '16px',
    lineHeight: 1.2,
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },

  buttonLSB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightMedium,
    fontSize: '16px',
    lineHeight: 1.2,
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },

  buttonMSB: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightMedium,
    fontSize: '14px',
    lineHeight: 1.4,
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },

  buttonM: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    fontSize: '14px',
    lineHeight: 1.4,
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },

  buttonS: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightMedium,
    fontSize: '13px',
    lineHeight: 1.3,
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },

  buttonX: {
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightMedium,
    fontSize: '10px',
    lineHeight: 1,
    letterSpacing: '0.02857em',
    textTransform: 'none',
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
