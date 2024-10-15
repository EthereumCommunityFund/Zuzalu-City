import React from 'react';
import { Typography, Stack, useTheme } from '@mui/material';
import { QRCodeIcon } from '@/components/icons';
import { RegistrationAndAccess } from '@/types';
import { StatusIndicatorPanel, useStatusContext } from '../Common';
import useRegAndAccess from '@/hooks/useRegAndAccess';
import CheckList from './CheckList';

interface TicketHeaderProps {
  regAndAccess?: RegistrationAndAccess;
}

const TicketHeader = ({ regAndAccess }: TicketHeaderProps) => {
  const breakpoints = useTheme().breakpoints;
  const { status } = useStatusContext();
  const { registrationOpen, checkinOpen } = status;

  const {
    handleRegistrationOpenChange,
    handleCheckinOpenChange,
    registrationAvailable,
    hasCheckin,
    showAccessRuleCheckin,
  } = useRegAndAccess({ regAndAccess });

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
        <>
          <CheckList regAndAccess={regAndAccess} />
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
              type="registration"
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
                type="checkin"
                name="Check-In Status"
                desc={
                  checkinOpen
                    ? 'OPEN'
                    : showAccessRuleCheckin
                      ? 'CLOSED'
                      : 'Unavailable'
                }
                checked={checkinOpen}
                disabled={!showAccessRuleCheckin}
                onChange={handleCheckinOpenChange}
              />
            )}
            <StatusIndicatorPanel
              name="Event Capacity"
              desc="COMING SOON"
              left={<QRCodeIcon />}
              disabled
            />
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default TicketHeader;
