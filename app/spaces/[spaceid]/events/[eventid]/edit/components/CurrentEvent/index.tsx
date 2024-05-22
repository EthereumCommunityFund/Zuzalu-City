import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { PlusIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import { EventMCard } from '@/components/cards';
import { Event } from '@/types';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface CurrentEventsProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
  events: Event[]
}

const CurrentEvents: React.FC<CurrentEventsProps> = ({
  onToggle = (anchor: Anchor, open: boolean) => { },
  events = []
}) => {
  return (
    <Stack direction="column" spacing={3} padding={2.5}>
      <Stack direction="row" spacing={3}>
        <Typography variant="h5" color="white">
          Events
        </Typography>
        <ZuButton
          startIcon={<PlusIcon size={5} />}
          onClick={() => onToggle('right', true)}
        >
          Add New Event
        </ZuButton>
      </Stack>
      <Stack direction="column" spacing={2}>
        <Typography
          variant="body2"
          color="white"
          fontStyle="italic"
          sx={{ opacity: 0.5 }}
        >
          Prototype Note: First card is click-able
        </Typography>
        {/* <EventMCard type={0} applicants={14} isSideEventActive={true} />
        <EventMCard type={0} applicants={14} />
        <EventMCard type={2} applicants={0} />
        <EventMCard type={1} applicants={3} /> */}
        {
          events.map((event, index) => (
            <EventMCard key={`EventMCard-Index${index}`} name={event.title} />
          ))
        }
      </Stack>
    </Stack>
  );
};

export default CurrentEvents;
