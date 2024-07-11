'use client';
import * as React from 'react';
import { Typography, Stack } from '@mui/material';
import {
  CalendarIcon,
  HomeIcon,
  SessionIcon,
  LockIcon,
} from 'components/icons';
import { ZuButton } from 'components/core';

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
      bgcolor="#2b2b2bcc"
      height="45px"
      alignItems="center"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      position={'sticky'}
      top={'50px'}
      zIndex={1001}
    >
      <Stack direction="row" spacing={2} height="100%">
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
          sx={{ cursor: 'pointer' }}
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
      {/* <Stack
        direction="row"
        height="100%"
        paddingLeft={3}
        borderLeft="1px solid #383838"
        spacing={1}
        alignItems="center"
        sx={{ cursor: 'pointer' }}
      >
        <ZuButton startIcon={<HomeIcon />} sx={{ backgroundColor: '#383838' }}>
          Event Feed
        </ZuButton>
      </Stack> */}
    </Stack>
  );
};

export default Subbar;
