'use client';

import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TextButton } from './Button';

export default function SpaceEditSidebar() {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        minxWidth: '260px',
        width: '260px',
        height: '100vh',
        boxSizing: 'border-box',
        borderRight: '1px solid rgba(255, 255, 255, 0.10)',
        paddingTop: '20px',
        paddingLeft: '20px',
        paddingBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontFamily: 'Inter',
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      }}
    >
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingBottom: '20px',
          boxSizing: 'border-box',
          borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        <Typography textTransform={'uppercase'} fontSize={'10px'}>
          General
        </Typography>
        <TextButton content="space overview" />
      </Stack>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingBottom: '20px',
          boxSizing: 'border-box',
          borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        <Typography fontSize={'10px'} textTransform={'uppercase'}>
          Member Management
        </Typography>
        <TextButton content="invites" />
      </Stack>
    </Stack>
  );
}
