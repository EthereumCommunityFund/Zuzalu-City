import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import TicketCard from './TicketCard';
import { TicketCardProps } from './TicketCard';
import { PlusIcon } from 'components/icons';
import { MOCK_DATA } from 'mock';
import { Contract } from '@/types';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface TicketListProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
  setToggleAction: React.Dispatch<React.SetStateAction<string>>;
  setVaultIndex: React.Dispatch<React.SetStateAction<number>>;
  tickets: Array<any>;
  ticketAddresses: Array<string>;
  eventContracts: Contract[];
}

const TicketList: React.FC<TicketListProps> = ({
  onToggle = (anchor: Anchor, open: boolean) => {},
  setToggleAction,
  tickets,
  ticketAddresses,
  setVaultIndex,
  eventContracts,
}) => {
  return (
    <Stack direction="column" spacing={3}>
      <Stack direction="column" spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, md: 4 }}
          justifyContent="space-between"
        >
          <Typography variant="h6" color="white">
            Event Tickets
          </Typography>
          <ZuButton
            startIcon={<PlusIcon />}
            onClick={() => {
              onToggle('right', true), setToggleAction('CreateTicket');
            }}
          >
            New Ticket
          </ZuButton>
        </Stack>
        {/* {MOCK_DATA.tickets.map((ticket: TicketCardProps, index: number) => ( */}
        {tickets.map((ticket: TicketCardProps, index: number) => {
          const eventContract = eventContracts.find((contract) => {
            if (contract.contractAddress) {
              return (
                contract.contractAddress.trim().toLowerCase() ===
                ticketAddresses[index].trim().toLowerCase()
              );
            }
            return false;
          });

          return (
            <TicketCard
              key={`TicketListItem-${index}`}
              ticket={ticket}
              index={index}
              setVaultIndex={setVaultIndex}
              ticketAddresses={ticketAddresses}
              onToggle={onToggle}
              setToggleAction={setToggleAction}
              eventContract={eventContract}
            />
          );
        })}
      </Stack>
      <Typography variant="body2" color="white" fontStyle="italic">
        Prototype Note: Below shows an empty state
      </Typography>
    </Stack>
  );
};

export default TicketList;
