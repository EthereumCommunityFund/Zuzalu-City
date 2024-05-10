'use client';

import { Header, Sidebar } from 'components/layout';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface SpacePageLayoutPropTypes {
  children: React.ReactNode;
}

export default function SpacePageLayout({
  children,
}: SpacePageLayoutPropTypes) {
  const theme = useTheme();

  return <Box sx={{ color: 'white' }}>{children}</Box>;
}
