import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { CheckCircleIcon, RightArrowCircleIcon } from 'components/icons';
import Ticket from './Ticket';

const EventRegister = () => {
  return (
    <Stack
      borderRadius="10px"
      spacing={1}
      border="1px solid #383838"
      bgcolor="#262626"
    >
      <Stack
        padding="10px 14px"
        borderBottom="1px solid #383838"
        bgcolor="#2d2d2d"
      >
        <Typography color="white" variant="subtitleS">
          Event Registration
        </Typography>
      </Stack>
      <Stack spacing="20px" padding="10px 20px">
        <Stack spacing="4px">
          <Typography color="white" variant="bodyMB">
            Purchase Ticket
          </Typography>
          <Typography color="white" variant="bodyS">
            All applications will require review
          </Typography>
        </Stack>
        <Stack spacing="10px">
          <Ticket />
          <Ticket />
          <Ticket />
        </Stack>
        <ZuButton
          sx={{
            backgroundColor: '#373b36',
            color: '#D7FFC4',
            width: '100%',
          }}
          startIcon={<RightArrowCircleIcon color="#D7FFC4" />}
        >
          Apply to Event
        </ZuButton>
        <Stack>
          <Typography color="white">+28 Applied</Typography>
        </Stack>
      </Stack>
      <Stack padding="14px" borderTop="1px solid #383838" spacing="5px">
        <Typography color="white" variant="bodyBB">
          Gated For:
        </Typography>
        <Typography color="white" variant="bodyS">
          Need to have as least one of the below credentials
        </Typography>
        <ZuButton
          sx={{ backgroundColor: '#495145', color: '#D7FFC4' }}
          endIcon={<CheckCircleIcon color="#D7FFC4" />}
        >
          Zuzalu Resident
        </ZuButton>
        <ZuButton sx={{ backgroundColor: '#313131' }}>
          ZuConnect Resident
        </ZuButton>
        <ZuButton sx={{ backgroundColor: '#313131' }}>
          DevConnect Attendee
        </ZuButton>
      </Stack>
    </Stack>
  );
};

export default EventRegister;
