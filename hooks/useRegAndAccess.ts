import {
  ApplyOption,
  ApplyRule,
} from '@/app/spaces/[spaceid]/adminevents/[eventid]/Tabs/Ticket/components/types';
import { useMemo } from 'react';
import { RegistrationAndAccess } from '@/types';

interface Props {
  regAndAccess?: RegistrationAndAccess;
}

const useRegAndAccess = ({ regAndAccess }: Props) => {
  const noApplication = useMemo(() => {
    if (
      regAndAccess?.applyRule === ApplyRule.NoApplication &&
      !regAndAccess?.applyOption?.includes(ApplyOption.RequireBasicInfo)
    ) {
      return true;
    }
    return false;
  }, [regAndAccess?.applyOption, regAndAccess?.applyRule]);

  return { noApplication };
};

export default useRegAndAccess;
