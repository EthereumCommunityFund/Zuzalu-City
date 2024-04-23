import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import ZuButton from 'components/core/Button';
import { PlusIcon, PlusCircleIcon } from 'components/icons';

const TicketAdd = () => {
  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" color="white">
          Event Tickets
        </Typography>
        <ZuButton startIcon={<PlusIcon />}>New Ticket</ZuButton>
      </Stack>
      <Typography variant="body2" color="white">
        These are tickets for this event
      </Typography>
      <Stack
        direction="column"
        alignItems="center"
        bgcolor="#383838"
        padding="20px 10px"
        borderRadius={2}
      >
        <PlusCircleIcon color="#6c6c6c" size={15} />
        <Typography variant="subtitle2" color="white">
          No Tickets
        </Typography>
        <Typography variant="body2" color="white">
          Create a ticket
        </Typography>
      </Stack>
    </Stack>
  );
};

export default TicketAdd;
