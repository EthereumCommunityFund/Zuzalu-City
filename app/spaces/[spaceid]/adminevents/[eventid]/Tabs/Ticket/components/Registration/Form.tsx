import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FormHeader from '@/components/form/FormHeader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { StepFour, StepOne, StepThree, StepTwo } from './Step';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ConfigFormType, schema, TicketingMethod } from '../types';
import {
  createRegAndAccess,
  updateRegAndAccess,
} from '@/services/event/regAndAccess';
import {
  CreateRegAndAccessRequest,
  RegistrationAndAccess,
  UpdateRegAndAccessRequest,
} from '@/types';
import { isDev } from '@/constant';
import { scroll, scrollSepolia } from 'viem/chains';
import { useCeramicContext } from '@/context/CeramicContext';
import { useCreateEventId } from '../../hooks/useCreateEventId';
import { useEventContext } from '../../../../EventContext';

interface RegistrationMethodSelectorProps {
  regAndAccess?: RegistrationAndAccess;
  onClose: () => void;
  initialStep?: number;
}

const ConfigForm: React.FC<RegistrationMethodSelectorProps> = ({
  onClose,
  initialStep = 1,
  regAndAccess,
}) => {
  const [step, setStep] = useState(initialStep);

  const { event } = useEventContext();
  const { createEventID } = useCreateEventId({ event: event! });
  const queryClient = useQueryClient();
  const pathname = useParams();
  const formMethods = useForm({
    resolver: yupResolver(schema),
    values: regAndAccess
      ? {
          apply: regAndAccess.applyRule,
          options: regAndAccess.applyOption,
          access: regAndAccess.registrationAccess,
          pass: regAndAccess.ticketType,
        }
      : {},
  });
  const { profile } = useCeramicContext();
  const profileId = profile?.id || '';

  const eventId = pathname.eventid.toString();

  const createMutation = useMutation({
    mutationFn: (input: CreateRegAndAccessRequest) => {
      return createRegAndAccess(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetchEventById'],
      });
      setStep(initialStep);
      formMethods.reset();
      onClose();
    },
  });
  const updateMutation = useMutation({
    mutationFn: (input: UpdateRegAndAccessRequest) => {
      return updateRegAndAccess(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetchEventById'],
      });
      setStep(initialStep);
      formMethods.reset();
      onClose();
    },
  });
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = useCallback(
    async (data: ConfigFormType) => {
      const { apply, options, whitelist, access, pass } = data;
      if (!regAndAccess?.id) {
        let scrollPassContractFactoryID;
        if (pass === TicketingMethod.ScrollPass) {
          scrollPassContractFactoryID = await createEventID();
        }
        const registrationWhitelist =
          whitelist
            ?.split(',')
            .filter(Boolean)
            .map(
              (address) =>
                `did:pkh:eip155:${isDev ? scrollSepolia.id : scroll.id}:${address.trim()}`,
            ) || undefined;
        createMutation.mutate({
          eventId,
          registrationWhitelist,
          applyOption: options || '',
          applyRule: apply!,
          registrationAccess: access!,
          ticketType: pass!,
          profileId,
          scrollPassContractFactoryID,
        });
      } else {
        updateMutation.mutate({
          eventId,
          id: regAndAccess!.id,
          type: 'method',
          applyOption: options || '',
          applyRule: apply!,
          registrationAccess: access!,
          ticketType: pass!,
        });
      }
    },
    [createMutation, eventId, profileId, regAndAccess, updateMutation],
  );

  const handleStep = useCallback(
    (type: 'next' | 'back') => {
      if (type === 'back' && step === initialStep) {
        onClose();
        return;
      }
      if (type === 'next' && step === 4) {
        formMethods.handleSubmit(handleSubmit)();
        return;
      }
      setStep((v) => (type === 'next' ? v + 1 : v - 1));
    },
    [formMethods, handleSubmit, initialStep, onClose, step],
  );

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  return (
    <Box>
      <FormHeader handleClose={onClose} title="Configure Passes" />
      <FormProvider {...formMethods}>
        {step === 1 ? (
          <StepOne
            handleClose={onClose}
            handleNext={() => handleStep('next')}
          />
        ) : step === 2 ? (
          <StepTwo
            isFirstStep={step === initialStep}
            handleClose={() => handleStep('back')}
            handleNext={() => handleStep('next')}
          />
        ) : step === 3 ? (
          <StepThree
            handleClose={() => handleStep('back')}
            handleNext={() => handleStep('next')}
          />
        ) : (
          <StepFour
            isLoading={isLoading}
            handleClose={() => handleStep('back')}
            handleNext={() => handleStep('next')}
          />
        )}
      </FormProvider>
    </Box>
  );
};

export default ConfigForm;
