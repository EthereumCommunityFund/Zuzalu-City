import { Stack } from '@mui/material';
import { ConfigPanel, TitleWithTag } from '../Common';
import { RegistrationStatus } from '../Status';
import ApplicationPanel from '../Application/Panel';
import AccessRules from '../AccessRules';
import { PlusCircleIcon, PlusIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import TicketCard, { TicketCardProps } from '../TicketList/TicketCard';
import { Contract, Event } from '@/types';
import { useCreateEventId } from '../../hooks/useCreateEventId';
import { useCallback } from 'react';

interface ScrollPassListProps {
  onToggle: () => void;
  setToggleAction: React.Dispatch<React.SetStateAction<string>>;
  setVaultIndex: React.Dispatch<React.SetStateAction<number>>;
  tickets: Array<any>;
  ticketAddresses: Array<string>;
  eventContracts: Contract[];
  event: Event;
}

export default function ScrollPassList({
  onToggle,
  setToggleAction,
  setVaultIndex,
  tickets,
  ticketAddresses,
  eventContracts,
  event,
}: ScrollPassListProps) {
  const { isLoading, createEventID } = useCreateEventId({ event });
  const isConfigured = false;

  const handleCreateTicket = useCallback(() => {
    if (!event?.contractID) {
      createEventID();
    } else {
      onToggle();
    }
  }, [createEventID, event?.contractID, onToggle]);

  return (
    <>
      <Stack spacing="20px">
        <Dialog
          showModal={isLoading}
          showActions={false}
          title="Creating Event ID"
          message="Please wait while we create the Event ID. This is a necessary step before creating tickets. The process may take a few moments to complete."
        />
        <TitleWithTag
          title="Event Ticketing"
          desc="These are tickets for this event"
          tags={[
            { type: 'pass', pass: 'scrollpass' },
            { type: 'warning', text: 'Required to open event' },
          ]}
          right={
            isConfigured ? (
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
        {!isConfigured ? (
          <ConfigPanel
            icon={
              <PlusCircleIcon size={7.5} color="rgba(255, 255, 255, 0.5)" />
            }
            title="No Tickets"
            desc="Create ticketing for this event"
            buttonText="Go Create"
            handleOpen={handleCreateTicket}
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
      <RegistrationStatus />
      <AccessRules type="scrollpass" />
      <ApplicationPanel />
    </>
  );
}
