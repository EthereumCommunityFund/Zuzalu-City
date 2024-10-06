import React from 'react';
import { Typography, Stack, useTheme } from '@mui/material';
import { QRCodeIcon } from '@/components/icons';
import { Event, RegistrationAndAccess } from '@/types';
import { StatusIndicatorPanel } from '../Common';
import { useEventContext } from '../../../../EventContext';
import useRegAndAccess from '@/hooks/useRegAndAccess';

interface TicketHeaderProps {
  regAndAccess?: RegistrationAndAccess;
}

const TicketHeader = ({ regAndAccess }: TicketHeaderProps) => {
  const breakpoints = useTheme().breakpoints;
  const { event, setEvent } = useEventContext();
  const registrationOpen = regAndAccess?.registrationOpen === '1';
  const checkinOpen = regAndAccess?.checkinOpen === '1';

  const { handleRegistrationOpenChange, registrationAvailable, hasCheckin } =
    useRegAndAccess({ regAndAccess });

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
      {regAndAccess && (
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
            name="Registration Status"
            desc={
              registrationOpen
                ? 'OPEN'
                : registrationAvailable
                  ? 'CLOSED'
                  : 'Unavailable'
            }
            checked={registrationOpen}
            disabled={!registrationAvailable}
            onChange={handleRegistrationOpenChange}
          />
          {hasCheckin && (
            <StatusIndicatorPanel
              name="Check-In Status"
              desc={checkinOpen ? 'OPEN' : 'CLOSED'}
              checked={checkinOpen}
              // disabled
              onChange={() => {}}
            />
          )}
          <StatusIndicatorPanel
            name="Event Capacity"
            desc="COMING SOON"
            left={<QRCodeIcon />}
            disabled
          />
        </Stack>
      )}
    </Stack>
  );
};

export default TicketHeader;
