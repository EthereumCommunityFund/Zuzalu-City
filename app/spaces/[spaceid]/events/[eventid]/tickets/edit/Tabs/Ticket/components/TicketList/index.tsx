import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import TicketCard from './TicketCard';
import { TicketCardProps } from './TicketCard';
import { PlusIcon } from 'components/icons';
import { MOCK_DATA } from 'mock';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface TicketListProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
}

const TicketList: React.FC<TicketListProps> = ({ onToggle = (anchor: Anchor, open: boolean) => {} }) => {

  return (
    <Stack direction="column" spacing={3}>
      <Stack direction="column" spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" color="white">
            Event Tickets
          </Typography>
          <ZuButton
            startIcon={<PlusIcon />}
            onClick={() => onToggle('right', true)}
          >
            New Ticket
          </ZuButton>
        </Stack>
        {MOCK_DATA.tickets.map((ticket: TicketCardProps, index: number) => (
          <TicketCard key={`TicketListItem-${index}`} {...ticket} />
        ))}
      </Stack>
      <Typography variant="body2" color="white" fontStyle="italic">
        Prototype Note: Below shows an empty state
      </Typography>
    </Stack>
  );
};

export default TicketList;
