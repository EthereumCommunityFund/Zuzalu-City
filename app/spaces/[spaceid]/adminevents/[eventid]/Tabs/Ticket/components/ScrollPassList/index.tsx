import { Skeleton, Stack } from '@mui/material';
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
import { useCallback, useMemo } from 'react';
import useRegAndAccess from '@/hooks/useRegAndAccess';
import { TagProps } from '../types';

interface ScrollPassListProps {
  onToggle: () => void;
  setToggleAction: React.Dispatch<React.SetStateAction<string>>;
  setVaultIndex: React.Dispatch<React.SetStateAction<number>>;
  ticketsIsLoading: boolean;
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
  ticketsIsLoading,
}: ScrollPassListProps) {
  const hasTickets = tickets.length > 0;

  const { registrationAvailable, noApplication, accessRulesAvailable } =
    useRegAndAccess({
      regAndAccess,
    });

  const tags = useMemo(() => {
    const tags: TagProps[] = [{ type: 'pass', pass: 'scrollpass' }];
    return tags;
  }, []);

  return (
    <>
      <Stack spacing="20px">
        <TitleWithTag
          title="Event Ticketing"
          desc="These are tickets for this event"
          tags={tags}
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
        {ticketsIsLoading ? (
          <Stack spacing="10px">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height="120px"
                width="100%"
              />
            ))}
          </Stack>
        ) : !hasTickets ? (
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
          <Stack spacing="10px">
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
                  regAndAccess={regAndAccess}
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
        )}
      </Stack>
      <AccessRules
        type="scrollpass"
        regAndAccess={regAndAccess}
        isAvailable={accessRulesAvailable}
        ticketAddresses={ticketAddresses}
      />
      <RegistrationStatus
        regAndAccess={regAndAccess}
        isAvailable={registrationAvailable}
      />
      {!noApplication && <ApplicationPanel regAndAccess={regAndAccess} />}
    </>
  );
}
