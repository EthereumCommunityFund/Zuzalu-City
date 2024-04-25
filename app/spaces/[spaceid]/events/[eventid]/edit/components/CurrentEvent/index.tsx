import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { PlusIcon } from 'components/icons';
import { ZuButton } from 'components/core';
import EventCard from '../EventCard';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface CurrentEventsProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
}

const CurrentEvents: React.FC<CurrentEventsProps> = ({ onToggle = (anchor: Anchor, open: boolean) => {} }) => {
  const click = () => {
    console.log("hello")
    onToggle('right', true)
  }

  return (
    <Stack direction='column' spacing={3} padding={2.5}>
      <Stack direction='row' spacing={3}>
        <Typography
          variant='h5'
          color="white"
        >
          Events
        </Typography>
        <ZuButton
          startIcon={<PlusIcon size={5} />}
          onClick={() => onToggle('right', true)}
        >
          Add New Event
        </ZuButton>
      </Stack>
      <Stack direction='column' spacing={2}>
        <Typography variant='body2' color='white' fontStyle='italic' sx={{opacity: 0.5}}>
          Prototype Note: First card is click-able
        </Typography>
        <EventCard type={0} applicants={14} isSideEventActive={true} />
        <EventCard type={0} applicants={14} />
        <EventCard type={2} applicants={0} />
        <EventCard type={1} applicants={3} />
      </Stack>
    </Stack>
  )
}

export default CurrentEvents;