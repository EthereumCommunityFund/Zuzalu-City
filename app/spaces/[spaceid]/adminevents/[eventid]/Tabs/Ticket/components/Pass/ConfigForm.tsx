import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import FormHeader from '@/components/form/FormHeader';
import { LeftArrowIcon, RightArrowIcon } from '@/components/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { updateCheckinPass } from '@/services/event/updateEvent';
import { StepOne, StepTwo } from './Step';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface RegistrationMethodSelectorProps {
  onClose: () => void;
}

const schema = yup.object().shape({
  access: yup.string(),
  whitelist: yup.string(),
  pass: yup.string(),
});

const ConfigForm: React.FC<RegistrationMethodSelectorProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);

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
      setStep(1);
      onClose();
    },
  });
  // const isLoading = updateEventPass.isPending;

  const handleStep = useCallback(
    (type: 'next' | 'back') => {
      if (step === 2) {
        // updateEventPass.mutateAsync({
        //   eventId,
        //   pass: selectedMethod,
        // });
        // return;
      }
      setStep((v) => (type === 'next' ? v + 1 : v - 1));
    },
    [step],
  );

  return (
    <Box
      sx={{
        width: '700px',
      }}
      role="presentation"
      zIndex="100"
      borderLeft="1px solid #383838"
    >
      <FormHeader handleClose={onClose} title="Configure Passes" />
      <FormProvider {...formMethods}>
        {step === 1 ? (
          <StepOne
            handleClose={onClose}
            handleNext={() => handleStep('next')}
          />
        ) : step === 2 ? (
          <StepTwo
            handleClose={() => handleStep('back')}
            handleNext={() => handleStep('next')}
          />
        ) : null}
      </FormProvider>
    </Box>
  );
};

export default ConfigForm;
