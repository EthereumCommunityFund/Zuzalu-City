import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { EventIcon, LockIcon, MapIcon } from 'components/icons';

const OverviewDetail = () => {
  return (
    <Stack
      marginY={4}
      padding={2}
      direction="row"
      spacing={2}
      bgcolor="#283734"
      borderRadius={3}
    >
      <Box
        component="img"
        src="/12.webp"
        borderRadius={3}
        height={450}
        width={450}
      />
      <Stack direction="column" flex={1} spacing={2}>
        <Stack direction="row" spacing={2}>
          <ZuButton sx={{ backgroundColor: '#2F4541', flex: 1 }}>
            Edit Event Details
          </ZuButton>
          <ZuButton sx={{ backgroundColor: '#2F4541', flex: 1 }}>
            View Event
          </ZuButton>
          <ZuButton sx={{ backgroundColor: '#2F4541', flex: 1 }}>
            Share Event
          </ZuButton>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="white">
            BY:
          </Typography>
          <Box component="img" src="/1.webp" height={20} width={20} />
          <Typography variant="body2" color="white">
            Zuzalu City Contributors
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EventIcon />
          <Typography variant="body1" color="white">
            October 8 - October 28
          </Typography>
        </Stack>
        <Typography variant="h5" color="white">
          ZuVillage Georgia
        </Typography>
        <Typography variant="body1" color="white">
          A two-month gathering of up to 500 individuals to promote/research the
          defensive, decentralized, differentiated, and democratic acceleration
          of technology.
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <MapIcon size={4} />
          <Typography variant="caption" color="white">
            GEORGIA
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <MapIcon size={4} />
          <Typography variant="caption" color="white">
            ONLINE
          </Typography>
        </Stack>
        <ZuButton
          startIcon={<LockIcon size={4} />}
          sx={{ backgroundColor: '#2F4541', maxWidth: '20%' }}
        >
          Gated
        </ZuButton>
      </Stack>
    </Stack>
  );
};

export default OverviewDetail;
