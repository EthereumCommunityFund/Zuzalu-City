import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FormHeader from '@/components/form/FormHeader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { StepFour, StepOne, StepThree, StepTwo } from './Step';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ConfigFormType, schema } from '../types';
import { createRegAndAccess } from '@/services/event/regAndAccess';
import { CreateRegAndAccessRequest } from '@/types';
import { isDev } from '@/constant';
import { scroll, scrollSepolia } from 'viem/chains';
import { useCeramicContext } from '@/context/CeramicContext';

interface RegistrationMethodSelectorProps {
  onClose: () => void;
  initialStep?: number;
}

const ConfigForm: React.FC<RegistrationMethodSelectorProps> = ({
  onClose,
  initialStep = 1,
}) => {
  const [step, setStep] = useState(initialStep);

  const queryClient = useQueryClient();
  const pathname = useParams();
  const formMethods = useForm({
    resolver: yupResolver(schema),
  });
  const { profile, ceramic } = useCeramicContext();
  const profileId = profile?.id || '';

  const eventId = pathname.eventid.toString();

  const createMutation = useMutation({
    mutationFn: (input: CreateRegAndAccessRequest) => {
      return createRegAndAccess(input);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['fetchEventById', eventId],
      });
      setStep(initialStep);
      formMethods.reset();
      onClose();
    },
  });
  const isLoading = createMutation.isPending;

  const handleSubmit = useCallback(
    (data: ConfigFormType) => {
      const { apply, options, whitelist, access, pass } = data;
      const registrationWhitelist = whitelist?.split(',').map((address) => ({
        id: `did:pkh:eip155:${isDev ? scrollSepolia.id : scroll.id}:${address}`,
      }));
      createMutation.mutate({
        eventId,
        registrationWhitelist,
        applyOption: options || '',
        applyRule: apply!,
        registrationAccess: access!,
        ticketType: pass!,
        profileId,
      });
    },
    [createMutation, eventId, profileId],
  );

  const handleStep = useCallback(
    (type: 'next' | 'back') => {
      if (type === 'back' && step === initialStep) {
        onClose();
        return;
      }
      if (type === 'next' && step === 5 - initialStep) {
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
