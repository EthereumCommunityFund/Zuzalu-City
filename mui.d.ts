import { TypographyVariants } from '@mui/material/styles/createTypography';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    hB: true;
    subtitleLB: true;
    subtitleL: true;
    subtitleMB: true;
    subtitleM: true;
    subtitleSB: true;
    subtitleS: true;
    bodyBB: true;
    bodyB: true;
    bodyMB: true;
    bodyM: true;
    bodySB: true;
    bodyS: true;
    bodyX: true;
    buttonLB: true;
    buttonLSB: true;
    buttonMSB: true;
    buttonM: true;
    buttonS: true;
    buttonX: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    hB: React.CSSProperties;
    subtitleLB: React.CSSProperties;
    subtitleL: React.CSSProperties;
    subtiteMB: React.CSSProperties;
    subtiteM: React.CSSProperties;
    subtiteSB: React.CSSProperties;
    subtiteS: React.CSSProperties;
    bodyBB: React.CSSProperties;
    bodyB: React.CSSProperties;
    bodyMB: React.CSSProperties;
    bodyM: React.CSSProperties;
    bodySB: React.CSSProperties;
    bodyS: React.CSSProperties;
    bodyX: React.CSSProperties;
    butttonLB: React.CSSProperties;
    butttonLSB: React.CSSProperties;
    butttonMSB: React.CSSProperties;
    butttonM: React.CSSProperties;
    butttonS: React.CSSProperties;
    butttonX: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    hB?: React.CSSProperties;
    subtitleLB?: React.CSSProperties;
    subtitleL?: React.CSSProperties;
    subtitleMB?: React.CSSProperties;
    subtitleM?: React.CSSProperties;
    subtitleSB?: React.CSSProperties;
    subtitleS?: React.CSSProperties;
    bodyBB?: React.CSSProperties;
    bodyB?: React.CSSProperties;
    bodyMB?: React.CSSProperties;
    bodyM?: React.CSSProperties;
    bodySB?: React.CSSProperties;
    bodyS?: React.CSSProperties;
    bodyX?: React.CSSProperties;
    buttonLB?: React.CSSProperties;
    buttonLSB?: React.CSSProperties;
    buttonMSB?: React.CSSProperties;
    buttonM?: React.CSSProperties;
    buttonS?: React.CSSProperties;
    buttonX?: React.CSSProperties;
  }
}
