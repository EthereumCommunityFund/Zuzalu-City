import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import EventCard from '../EventCard';

const PastEvents = () => {
  return (
    <Stack direction='column' spacing={3} padding={2.5}>
      <Typography
        variant='h5'
        color="white"
      >
        Past Events
      </Typography>
      <Stack direction='column' spacing={2}>
        <EventCard type={3} applicants={14} />
        <EventCard type={3} applicants={3} />
      </Stack>
    </Stack>
  )
}

export default PastEvents;