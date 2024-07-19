'use client';

import { Header, Sidebar } from 'components/layout';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';

interface SpacePageLayoutPropTypes {
  children: React.ReactNode;
}

export default function SpacePageLayout({
  children,
}: SpacePageLayoutPropTypes) {
  const theme = useTheme();

  return (
    <Box
      sx={{ color: 'white', display: 'flex', flexDirection: 'row' }}
      minHeight={'calc(100vh - 50px)'}
    >
      {children}
    </Box>
  );
}
