import React from 'react';
import { Typography, Stack, useTheme } from '@mui/material';
import { QRCodeIcon } from '@/components/icons';
import { Event } from '@/types';
import { StatusIndicatorPanel } from '../Common';

interface PropTypes {
  event?: Event;
  visible?: boolean;
}
const TicketHeader = ({ event, visible }: PropTypes) => {
  const breakpoints = useTheme().breakpoints;

  return (
    <Stack
      direction="column"
      spacing={2}
      paddingBottom={'30px'}
      borderBottom={'1px solid rgba(255,255,255,0.10)'}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
      >
        <Typography variant="h5" color="white">
          Event Registration
        </Typography>
      </Stack>
      <Stack
        direction="row"
        gap="20px"
        sx={{
          [breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px',
          },
        }}
      >
        <StatusIndicatorPanel
          name="Registration"
          desc="CLOSED"
          checked={true}
          // disabled
          onChange={() => {}}
        />
        <StatusIndicatorPanel
          name="Event Check-In"
          desc="CLOSED"
          checked={false}
          disabled
          onChange={() => {}}
        />
        <StatusIndicatorPanel
          name="Event Capacity"
          desc="COMING SOON"
          left={<QRCodeIcon />}
          disabled
        />
      </Stack>
    </Stack>
  );
};

export default TicketHeader;
