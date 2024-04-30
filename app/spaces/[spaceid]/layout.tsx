"use client";

import { Header, Sidebar } from 'components/layout';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface SpacePageLayoutPropTypes {
  children: React.ReactNode;
}

export default function SpacePageLayout({
  children,
}: SpacePageLayoutPropTypes) {

  const theme = useTheme();

  return (
    <Box sx={{ color: 'white' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: "space-between"
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Box
            sx={{
              display: 'block',
              [theme.breakpoints.down('md')]: {
                display: 'none'
              }
            }}
          >
            <Sidebar></Sidebar>
          </Box>
          <SubSidebar></SubSidebar>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
