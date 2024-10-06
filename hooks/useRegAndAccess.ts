import {
  ApplyOption,
  ApplyRule,
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
import { TicketType } from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Ticket/components/CreateTicket';

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

  const updateRegistrationOpenMutation = useMutation({
    mutationFn: updateRegAndAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchEventById'] });
    },
    onMutate: () => {
      if (event) {
        setEvent({
          ...event,
          regAndAccess: {
            edges: [
              {
                node: {
                  ...regAndAccess!,
                  registrationOpen: !registrationOpen ? '1' : '0',
                },
              },
            ],
          },
        });
      }
    },
  });

  const handleRegistrationOpenChange = useCallback(
    debounce((checked: boolean) => {
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

  const registrationAvailable = useMemo(() => {
    if (regAndAccess?.ticketType === TicketingMethod.NoTicketing) {
      return noApplication || hasConfigedApplicationForm;
    }
    return false;
  }, [hasConfigedApplicationForm, noApplication, regAndAccess?.ticketType]);

  return {
    noApplication,
    hasConfigedApplicationForm,
    updateRegistrationOpenMutation,
    handleRegistrationOpenChange,
    registrationAvailable,
    hasCheckin,
  };
};

export default useRegAndAccess;
