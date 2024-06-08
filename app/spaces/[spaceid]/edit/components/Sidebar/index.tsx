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
      padding="20px 10px 0 20px"
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
        <Typography
          textTransform="uppercase"
          sx={{ fontSize: '10px', fontWeight: 300 }}
        >
          General
        </Typography>
        <Typography
          variant="bodySB"
          sx={{
            fontSize: '13px',
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
        <Typography
          textTransform="uppercase"
          sx={{ fontSize: '10px', fontWeight: 300 }}
        >
          Member Management
        </Typography>
        <Typography
          variant="bodySB"
          sx={{
            fontSize: '13px',
            cursor: 'pointer',
            backgroundColor: tabName === 'Overview' ? '#2d2d2d' : 'black',
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
            opacity: 0.7,
          }}
        >
          Coming Soon
        </Typography>
      </Stack>
    </Stack>
  );
};

export default SpaceEditSidebar;
