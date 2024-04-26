import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { PlusIcon, InformationIcon } from 'components/icons';

const Invite = () => {
  return (
    <Stack direction="column" spacing={1} padding={2.5}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" color="white">
            Invite Event Admins
          </Typography>
          <InformationIcon color="#919191" size={5} />
        </Stack>
        <ZuButton startIcon={<PlusIcon size={4} />}>Invite</ZuButton>
      </Stack>
      <Typography color="white">
        Invite users to manage access of attendees and scan tickets
      </Typography>
      <Stack
        bgcolor="#262626"
        borderRadius={2}
        padding={1}
        sx={{ opacity: 0.8 }}
      >
        <Typography variant="h6" color="white">
          No Invites
        </Typography>
        <Typography variant="caption" color="white">
          You can invite members or other individuals via email
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Invite;
