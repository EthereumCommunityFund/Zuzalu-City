import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import ZuButton from 'components/core/Button';
import { PlusIcon, PlusCircleIcon } from 'components/icons';

const SessionAdd = () => {
  return (
    <Stack direction="column" spacing={0.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Session List</Typography>
        <ZuButton startIcon={<PlusIcon />}>Add a Session</ZuButton>
      </Stack>
      <Typography variant="body2">
        Sessions makeup the schedule of an event
      </Typography>
      <Stack
        direction="column"
        alignItems="center"
        bgcolor="#2d2d2d"
        padding="20px 10px"
        borderRadius={2}
      >
        <PlusCircleIcon color="#6c6c6c" size={15} />
        <Typography variant="subtitle2">No Sessions</Typography>
        <Typography variant="body2">Create a Session</Typography>
      </Stack>
    </Stack>
  );
};

export default SessionAdd;
