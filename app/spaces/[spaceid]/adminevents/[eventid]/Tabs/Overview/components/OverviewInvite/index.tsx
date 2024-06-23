import * as React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { InformationIcon, PlusIcon } from 'components/icons';
import { ZuButton } from 'components/core';
import { Event } from '@/types';

interface PropTypes {
  event?: Event
}

const OverviewInvite = ({ event }: PropTypes) => {
  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" color="white">
            Host
          </Typography>
          <InformationIcon color="#919191" size={5} />
        </Stack>
        {/* <ZuButton startIcon={<PlusIcon size={4} />}>Invite</ZuButton> */}
      </Stack>
      <Stack borderRadius={3} bgcolor="#383838" padding={1}>
        <Stack direction="row" spacing={2}>
          <Box
            component="img"
            height={40}
            width={40}
            borderRadius={5}
            src={event?.profile?.avatar ? event.profile.avatar : "/logo.webp"}
          />
          <Stack>
            <Typography variant="subtitle2" color="white">
              {
                event?.profile?.username ? event?.profile?.username : ''
              }
            </Typography>
            {/* <Typography variant="caption" color="white">
              simon@ecf.network
            </Typography> */}
          </Stack>
          {
            event?.profile?.username && <ZuButton sx={{ backgroundColor: '#353535', padding: '2px' }}>
              event creator
            </ZuButton>
          }
        </Stack>
      </Stack>
    </Stack>

  );
};

export default OverviewInvite;
