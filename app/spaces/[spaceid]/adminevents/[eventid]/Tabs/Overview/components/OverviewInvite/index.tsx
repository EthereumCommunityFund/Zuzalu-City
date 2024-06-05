import * as React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { InformationIcon, PlusIcon } from 'components/icons';
import { ZuButton } from 'components/core';

const OverviewInvite = () => {
  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" color="white">
            Invite Hosts
          </Typography>
          <InformationIcon color="#919191" size={5} />
        </Stack>
        <ZuButton startIcon={<PlusIcon size={4} />}>Invite</ZuButton>
      </Stack>
      <Stack borderRadius={3} bgcolor="#383838" padding={1}>
        <Stack direction="row" spacing={2}>
          <Box
            component="img"
            height={40}
            width={40}
            borderRadius={5}
            src="/drivenfast.webp"
          />
          <Stack>
            <Typography variant="subtitle2" color="white">
              drivenfast
            </Typography>
            <Typography variant="caption" color="white">
              simon@ecf.network
            </Typography>
          </Stack>
          <ZuButton sx={{ backgroundColor: '#353535', padding: '2px' }}>
            event creator
          </ZuButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OverviewInvite;
