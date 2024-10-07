import {
  ApplyOption,
  ApplyRule,
  RegistrationAccess,
  TicketingMethod,
} from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Ticket/components/types';
import { useCallback, useMemo } from 'react';
import { RegistrationAndAccess } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRegAndAccess } from '@/services/event/regAndAccess';
import { useEventContext } from '@/app/spaces/[spaceid]/adminevents/[eventid]/EventContext';
import { debounce } from 'lodash';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';

interface Props {
  regAndAccess?: RegistrationAndAccess;
}

const useRegAndAccess = ({ regAndAccess }: Props) => {
  const queryClient = useQueryClient();
  const { event, setEvent } = useEventContext();
  const pathname = useParams();
  const { profile } = useCeramicContext();
  const profileId = profile?.id || '';
  const eventId = pathname.eventid.toString();

  const registrationOpen = regAndAccess?.registrationOpen === '1';
  const checkinOpen = regAndAccess?.checkinOpen === '1';
  const updateRegistrationOpenMutation = useMutation({
    mutationFn: updateRegAndAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchEventById'] });
    },
  });

  const changeOpen = useCallback(
    (type: 'registration' | 'checkin') => {
      const obj =
        type === 'checkin'
          ? {
              checkinOpen: !checkinOpen ? '1' : '0',
            }
          : {
              registrationOpen: !registrationOpen ? '1' : '0',
            };
      if (event) {
        setEvent({
          ...event,
          regAndAccess: {
            edges: [
              {
                node: {
                  ...regAndAccess!,
                  ...obj,
                },
              },
            ],
          },
        });
      }
    },
    [checkinOpen, registrationOpen, event, setEvent, regAndAccess],
  );

  const handleRegistrationOpenChange = useCallback(
    debounce((checked: boolean) => {
      changeOpen('registration');
      updateRegistrationOpenMutation.mutate({
        type: 'switch',
        id: regAndAccess!.id,
        profileId,
        eventId,
        registrationOpen: checked ? '1' : '0',
      });
    }, 1000),
    [],
  );

  const handleCheckinOpenChange = useCallback(
    debounce((checked: boolean) => {
      changeOpen('checkin');
      updateRegistrationOpenMutation.mutate({
        type: 'switch',
        id: regAndAccess!.id,
        profileId,
        eventId,
        checkinOpen: checked ? '1' : '0',
      });
    }, 1000),
    [],
  );

  const noApplication = useMemo(() => {
    if (
      regAndAccess?.applyRule === ApplyRule.NoApplication &&
      !regAndAccess?.applyOption?.includes(ApplyOption.RequireBasicInfo)
    ) {
      return true;
    }
    return false;
  }, [regAndAccess?.applyOption, regAndAccess?.applyRule]);

  const hasConfigedApplicationForm = !!regAndAccess?.applicationForm;
  const hasCheckin = regAndAccess?.ticketType !== TicketingMethod.NoTicketing;

  const showAccessRuleCheckin = useMemo(() => {
    if (regAndAccess?.ticketType === TicketingMethod.ScrollPass) {
      return regAndAccess.scrollPassTickets?.some(
        (ticket) => ticket.checkin === '1',
      );
    }
    return false;
  }, [regAndAccess?.ticketType, regAndAccess?.scrollPassTickets]);

  const registrationAvailable = useMemo(() => {
    let hasWhitelist =
      regAndAccess?.registrationAccess !== RegistrationAccess.Whitelist;
    hasWhitelist = Number(regAndAccess?.registrationWhitelist?.length) > 0;

    if (regAndAccess?.ticketType === TicketingMethod.NoTicketing) {
      return hasWhitelist && (noApplication || hasConfigedApplicationForm);
    }
    if (regAndAccess?.ticketType === TicketingMethod.ZuPass) {
      return (
        hasWhitelist && hasConfigedApplicationForm && !!regAndAccess?.zuPassInfo
      );
    }
    if (regAndAccess?.ticketType === TicketingMethod.ScrollPass) {
      const hasConfigTicketCheckin = regAndAccess.scrollPassTickets?.some(
        (ticket) => ticket.checkin === '1',
      );
      return (
        hasWhitelist &&
        hasConfigedApplicationForm &&
        !!regAndAccess?.scrollPassTickets?.length &&
        hasConfigTicketCheckin
      );
    }
    return false;
  }, [
    hasConfigedApplicationForm,
    noApplication,
    regAndAccess?.registrationAccess,
    regAndAccess?.registrationWhitelist?.length,
    regAndAccess?.scrollPassTickets,
    regAndAccess?.ticketType,
    regAndAccess?.zuPassInfo,
  ]);

  const accessRulesAvailable = useMemo(() => {
    if (regAndAccess?.ticketType === TicketingMethod.ScrollPass) {
      return (regAndAccess?.scrollPassTickets?.length ?? 0) > 0;
    }
    if (regAndAccess?.ticketType === TicketingMethod.ZuPass) {
      return !!regAndAccess?.zuPassInfo;
    }
    return true;
  }, [
    regAndAccess?.ticketType,
    regAndAccess?.scrollPassTickets?.length,
    regAndAccess?.zuPassInfo,
  ]);

  return {
    noApplication,
    hasConfigedApplicationForm,
    updateRegistrationOpenMutation,
    handleRegistrationOpenChange,
    registrationAvailable,
    hasCheckin,
    accessRulesAvailable,
    showAccessRuleCheckin,
    handleCheckinOpenChange,
  };
};

export default useRegAndAccess;
