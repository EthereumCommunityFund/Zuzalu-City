import * as React from 'react';
import { Typography, Stack } from '@mui/material';
import { CalendarIcon, SessionIcon, LockIcon } from 'components/icons';

interface TabbarProps {
  tabName: string;
  setTabName: (value: string | ((prevVar: string) => string)) => void;
  canViewSessions: boolean;
}

const Thumb: React.FC<TabbarProps> = ({
  tabName,
  setTabName,
  canViewSessions,
}) => {
  return (
    <Stack
      direction="row"
      paddingX={2}
      spacing={3}
      bgcolor="#2b2b2bcc"
      height="45px"
      alignItems="center"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      sx={{
        position: 'sticky',
        top: '0px',
        zIndex: 1,
        backgroundColor: '#222222',
      }}
    >
      <Stack direction="row" spacing={2} height="45px">
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          borderBottom={tabName === 'About' ? '1px solid white' : 'none'}
          sx={{ cursor: 'pointer' }}
        >
          <CalendarIcon />
          <Typography
            onClick={() => setTabName('About')}
            color="white"
            variant="bodyMB"
          >
            About
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          borderBottom={tabName === 'Sessions' ? '1px solid white' : 'none'}
          sx={{ cursor: canViewSessions ? 'pointer' : 'not-allowed' }}
        >
          {canViewSessions ? <SessionIcon /> : <LockIcon />}
          <Typography
            onClick={() => canViewSessions && setTabName('Sessions')}
            color="white"
            variant="bodyMB"
            sx={{ cursor: canViewSessions ? 'pointer' : 'not-allowed' }}
          >
            Sessions
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        paddingLeft={3}
        borderLeft="1px solid #383838"
        sx={{ cursor: 'pointer' }}
      >
        <Typography
          onClick={() => setTabName('Values')}
          color="white"
          variant="bodyMB"
          borderBottom={tabName === 'Venue' ? '1px solid white' : 'none'}
          sx={{ cursor: 'pointer' }}
        >
          Host Announcements
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Thumb;
