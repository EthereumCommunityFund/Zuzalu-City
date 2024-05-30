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
      width="260px"
      height="100vh"
      padding="20px 0 0 20px"
      spacing="10px"
      sx={{
        borderRight: '1px solid rgba(255, 255, 255, 0.10)',
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      }}
    >
      <Stack
        spacing="10px"
        sx={{
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        <Typography textTransform="uppercase" variant="caption">
          General
        </Typography>
        <Typography
          variant="bodySB"
          sx={{
            cursor: 'pointer',
            backgroundColor: tabName === 'Overview' ? '#2d2d2d' : 'black',
            padding: '6px 10px',
            borderRadius: '8px',
          }}
          onClick={() => setTabName('Overview')}
        >
          Space Overview
        </Typography>
      </Stack>
      <Stack
        spacing="10px"
        sx={{
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        <Typography fontSize={'10px'} textTransform={'uppercase'}>
          Member Management
        </Typography>
        <Typography
          variant="bodySB"
          sx={{
            cursor: 'pointer',
            backgroundColor: tabName === 'Invite' ? '#2d2d2d' : 'black',
            padding: '6px 10px',
            borderRadius: '8px',
          }}
          onClick={() => setTabName('Invite')}
        >
          Invite
        </Typography>
      </Stack>
      <Stack spacing="10px">
        <Typography fontSize={'10px'} textTransform={'uppercase'}>
          Apps
        </Typography>
        <Typography
          variant="bodySB"
          sx={{
            cursor: 'pointer',
            backgroundColor: tabName === 'Apps' ? '#2d2d2d' : 'black',
            padding: '6px 10px',
            borderRadius: '8px',
          }}
          onClick={() => setTabName('Invite')}
        >
          Coming Soon
        </Typography>
      </Stack>
    </Stack>
  );
};

export default SpaceEditSidebar;
