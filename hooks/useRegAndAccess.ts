import {
  ApplyOption,
  ApplyRule,
  RegistrationAccess,
  TicketingMethod,
} from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Ticket/components/types';
import { useCallback, useMemo, useRef } from 'react';
import { RegistrationAndAccess } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRegAndAccess } from '@/services/event/regAndAccess';
import { debounce } from 'lodash';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';
import { useEventContext } from '@/app/spaces/[spaceid]/adminevents/[eventid]/EventContext';
import { useStatusContext } from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Ticket/components/Common';

interface Props {
  regAndAccess?: RegistrationAndAccess;
}

const useRegAndAccess = (props: Props) => {
  const { event } = useEventContext();
  const { status } = useStatusContext();
  const regAndAccess = event?.regAndAccess?.edges?.[0]?.node;
  const queryClient = useQueryClient();
  const pathname = useParams();
  const { profile } = useCeramicContext();
  const profileId = profile?.id || '';
  const eventId = pathname.eventid.toString();

  const abortControllerRef = useRef<AbortController | null>(null);

  const updateRegistrationOpenMutation = useMutation({
    mutationFn: async (data: any) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      return updateRegAndAccess(
        {
          type: 'switch',
          id: regAndAccess!.id,
          profileId,
          eventId,
          registrationOpen: status.registrationOpen ? '1' : '0',
          checkinOpen: status.checkinOpen ? '1' : '0',
          ...data,
        },
        abortControllerRef.current.signal,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchEventById'] });
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ['fetchEventById'] });
    },
  });

  const handleRegistrationOpenChange = useCallback(
    debounce((checked: boolean) => {
      updateRegistrationOpenMutation.mutate({
        registrationOpen: checked ? '1' : '0',
      });
    }, 1000),
    [],
  );

  const handleCheckinOpenChange = useCallback(
    debounce((checked: boolean) => {
      updateRegistrationOpenMutation.mutate({
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

  const hasCheckin = useMemo(() => {
    return (
      regAndAccess?.ticketType !== TicketingMethod.NoTicketing &&
      regAndAccess?.ticketType !== TicketingMethod.LottoPGF
    );
  }, [regAndAccess?.ticketType]);

  const showAccessRuleCheckin = useMemo(() => {
    if (regAndAccess?.ticketType === TicketingMethod.ScrollPass) {
      return regAndAccess.scrollPassTickets?.some(
        (ticket) => ticket.checkin === '1',
      );
    }
    if (regAndAccess?.ticketType === TicketingMethod.ZuPass) {
      return regAndAccess.zuPassInfo?.some((ticket) => ticket.access);
    }
    return false;
  }, [
    regAndAccess?.ticketType,
    regAndAccess?.scrollPassTickets,
    regAndAccess?.zuPassInfo,
  ]);

  const registrationAvailable = useMemo(() => {
    let needWhitelist =
      regAndAccess?.registrationAccess !== RegistrationAccess.Whitelist;
    const hasWhitelist = needWhitelist
      ? true
      : Number(regAndAccess?.registrationWhitelist?.length) > 0;

    if (regAndAccess?.ticketType === TicketingMethod.NoTicketing) {
      return hasWhitelist && (noApplication || hasConfigedApplicationForm);
    }
    if (regAndAccess?.ticketType === TicketingMethod.LottoPGF) {
      return hasWhitelist;
    }
    return hasWhitelist && hasConfigedApplicationForm;
  }, [hasConfigedApplicationForm, noApplication, regAndAccess]);

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
