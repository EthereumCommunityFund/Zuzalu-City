import { Stack } from '@mui/material';
import { ConfigPanel, TitleWithTag } from '../Common';
import { RegistrationStatus } from '../Status';
import ApplicationPanel from '../Application/Panel';
import AccessRules from '../AccessRules';
import { PlusCircleIcon, PlusIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import TicketCard, { TicketCardProps } from '../TicketList/TicketCard';
import { Contract, Event, RegistrationAndAccess } from '@/types';
import { useCreateEventId } from '../../hooks/useCreateEventId';
import { useCallback } from 'react';
import useRegAndAccess from '@/hooks/useRegAndAccess';

interface ScrollPassListProps {
  onToggle: () => void;
  setToggleAction: React.Dispatch<React.SetStateAction<string>>;
  setVaultIndex: React.Dispatch<React.SetStateAction<number>>;
  tickets: Array<any>;
  ticketAddresses: Array<string>;
  eventContracts: Contract[];
  event: Event;
  regAndAccess?: RegistrationAndAccess;
}

export default function ScrollPassList({
  onToggle,
  setToggleAction,
  setVaultIndex,
  tickets,
  ticketAddresses,
  eventContracts,
  regAndAccess,
}: ScrollPassListProps) {
  const hasTickets = tickets.length > 0;

  const { registrationAvailable, noApplication } = useRegAndAccess({
    regAndAccess,
  });

  return (
    <>
      <Stack spacing="20px">
        <TitleWithTag
          title="Event Ticketing"
          desc="These are tickets for this event"
          tags={[
            { type: 'pass', pass: 'scrollpass' },
            { type: 'warning', text: 'Required to open event' },
          ]}
          required={!hasTickets}
          right={
            hasTickets ? (
              <ZuButton
                startIcon={<PlusIcon size={4} />}
                sx={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
                onClick={onToggle}
              >
                Add a ticket
              </ZuButton>
            ) : undefined
          }
          onClick={onToggle}
        />
        {!hasTickets ? (
          <ConfigPanel
            icon={
              <PlusCircleIcon size={7.5} color="rgba(255, 255, 255, 0.5)" />
            }
            title="No Tickets"
            desc="Create ticketing for this event"
            buttonText="Go Create"
            handleOpen={onToggle}
          />
        ) : (
          <>
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
          </>
        )}
      </Stack>
      <RegistrationStatus
        regAndAccess={regAndAccess}
        isAvailable={registrationAvailable}
      />
      <AccessRules type="scrollpass" />
      {!noApplication && <ApplicationPanel regAndAccess={regAndAccess} />}
    </>
  );
}
