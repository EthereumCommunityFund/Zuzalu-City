'use client';
import * as React from 'react';
import { Typography, Stack } from '@mui/material';
import { CalendarIcon, HomeIcon, SessionIcon } from 'components/icons';
import { ZuButton } from 'components/core';

interface SubbarProps {
  tabName: string;
  setTabName: (value: string | ((prevVar: string) => string)) => void;
}

const Subbar: React.FC<SubbarProps> = ({ tabName, setTabName }) => {
  return (
    <Stack
      direction="row"
      paddingX={2}
      spacing={3}
      bgcolor="#2b2b2bcc"
      height="45px"
      alignItems="center"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
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
          <SessionIcon />
          <Typography
            onClick={() => setTabName('Sessions')}
            color="white"
            variant="bodyMB"
            sx={{ cursor: 'pointer' }}
          >
            Sessions
          </Typography>
        </Stack>
      </Stack>
      <Stack
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
      </Stack>
    </Stack>
  );
};

export default Subbar;
