import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { PlusIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import { EventMCard } from '@/components/cards';
import { Event } from '@/types';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface CurrentEventsProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
  events: Event[];
}

const CurrentEvents: React.FC<CurrentEventsProps> = ({
  onToggle = (anchor: Anchor, open: boolean) => {},
  events = [],
}) => {
  return (
    <Stack direction="column" spacing={3} padding={2.5}>
      <Stack direction="row" spacing={3}>
        <Typography variant="h5" color="white">
          Events
        </Typography>
        <ZuButton
          startIcon={<PlusIcon size={4} />}
          sx={{ paddingLeft: '12px' }}
          onClick={() => onToggle('right', true)}
        >
          Add New Event
        </ZuButton>
      </Stack>
      <Stack direction="column" spacing={2}>
        {events.map((event, index) => (
          <EventMCard key={`EventMCard-Index${index}`} event={event} />
        ))}
      </Stack>
    </Stack>
  );
};

export default CurrentEvents;
