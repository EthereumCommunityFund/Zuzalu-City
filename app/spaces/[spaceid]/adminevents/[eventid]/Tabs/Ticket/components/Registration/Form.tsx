import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FormHeader from '@/components/form/FormHeader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { updateCheckinPass } from '@/services/event/updateEvent';
import { StepFour, StepOne, StepThree, StepTwo } from './Step';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../types';

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

  const eventId = pathname.eventid.toString();

  const updateEventPass = useMutation({
    mutationFn: ({ eventId, pass }: { eventId: string; pass: string }) => {
      return updateCheckinPass(eventId, pass);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['fetchEventById', eventId],
      });
      setStep(initialStep);
      onClose();
    },
  });
  // const isLoading = updateEventPass.isPending;

  const handleStep = useCallback(
    (type: 'next' | 'back') => {
      if (type === 'back' && step === initialStep) {
        onClose();
        return;
      }
      if (type === 'next' && step === 5 - initialStep) {
        // 如果需要在 step 2 执行特定操作，可以在这里添加逻辑
        // 例如：
        // updateEventPass.mutateAsync({
        //   eventId,
        //   pass: formMethods.getValues('selectedMethod'),
        // });
        return;
      }
      setStep((v) => (type === 'next' ? v + 1 : v - 1));
    },
    [initialStep, onClose, step],
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
            handleClose={() => handleStep('back')}
            handleNext={() => handleStep('next')}
          />
        )}
      </FormProvider>
    </Box>
  );
};

export default ConfigForm;
