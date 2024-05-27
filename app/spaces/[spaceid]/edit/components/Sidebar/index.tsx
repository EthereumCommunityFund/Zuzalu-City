'use client';

import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface SidebarProps {
  tabName: string;
  setTabName: (value: string | ((prevVar: string) => string)) => void;
}

const SpaceEditSidebar: React.FC<SidebarProps> = ({ tabName, setTabName }) => {
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
        <Typography textTransform='uppercase' variant='caption'>
          General
        </Typography>
        <Typography variant='bodySB' sx={{ cursor: 'pointer' }} onClick={() => setTabName('Overview')}>Space Overview</Typography>
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
        <Typography variant='bodySB' sx={{ cursor: 'pointer' }} onClick={() => setTabName('Invite')}>Invite</Typography>
      </Stack>
    </Stack>
  );
}

export default SpaceEditSidebar;