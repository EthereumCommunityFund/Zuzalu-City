"use client";

import { Header, Sidebar } from 'components/layout';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';
import { Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface SpacePageLayoutPropTypes {
  children: React.ReactNode;
}

export default function SpacePageLayout({
  children,
}: SpacePageLayoutPropTypes) {

  const theme = useTheme();

  return (
    <Stack sx={{ color: 'white' }}>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: "space-between"
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Stack
            sx={{
              display: 'none',
              [theme.breakpoints.up('lg')]: {
                display: 'block'
              }
            }}
          >
            <Sidebar></Sidebar>
          </Stack>
          <SubSidebar></SubSidebar>
        </Stack>
        {children}
      </Stack>
    </Stack>
  );
}
