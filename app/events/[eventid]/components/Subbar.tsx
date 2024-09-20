'use client';
import * as React from 'react';
import { Typography, Stack } from '@mui/material';
import {
  CalendarIcon,
  SessionIcon,
  LockIcon,
  AnnouncementsIcon,
} from 'components/icons';

interface SubbarProps {
  tabName: string;
  setTabName: (value: string | ((prevVar: string) => string)) => void;
  canViewSessions: boolean;
}

const Subbar: React.FC<SubbarProps> = ({
  tabName,
  setTabName,
  canViewSessions,
}) => {
  return (
    <Stack
      direction="row"
      paddingX={2}
      spacing={3}
      bgcolor="#222"
      height="45px"
      alignItems="center"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      position={'sticky'}
      top={'50px'}
      zIndex={3}
      width="100vw"
      maxWidth="100vw"
      sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
    >
      <Stack direction="row" height="100%">
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          borderBottom={tabName === 'About' ? '1px solid white' : 'none'}
          sx={{ cursor: 'pointer', padding: '0 14px' }}
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
          sx={{ cursor: 'pointer', padding: '0 14px' }}
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
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          borderBottom={
            tabName === 'Announcements' ? '1px solid white' : 'none'
          }
          sx={{ cursor: 'pointer', padding: '0 14px' }}
        >
          <AnnouncementsIcon />
          <Typography
            onClick={() => setTabName('Announcements')}
            color="white"
            variant="bodyMB"
          >
            Announcements
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Subbar;
