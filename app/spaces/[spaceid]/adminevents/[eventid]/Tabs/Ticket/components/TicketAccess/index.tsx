import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import ZuButton from 'components/core/Button';
import { PlusIcon } from 'components/icons';

const TicketAccess = () => {
  return (
    <Stack direction="column" spacing={1} paddingBottom={'50px'}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
      >
        <Typography variant="h6" color="white">
          Access Management Staff
        </Typography>
        <ZuButton startIcon={<PlusIcon />}>Invite</ZuButton>
      </Stack>
      <Typography variant="body1" color="white">
        Door Staff - Invite users to only manage access of attendees and scan
        tickets
      </Typography>
      <Stack
        padding={1}
        direction="column"
        spacing={0.5}
        borderRadius={3}
        bgcolor="#2d2d2d"
      >
        <Typography variant="subtitle2" color="white">
          No Invites
        </Typography>
        <Typography variant="caption" color="white">
          You can invite members or other individuals via email
        </Typography>
      </Stack>
    </Stack>
  );
};

export default TicketAccess;
