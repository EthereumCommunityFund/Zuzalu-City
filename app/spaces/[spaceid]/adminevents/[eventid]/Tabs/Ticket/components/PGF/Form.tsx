import FormHeader from '@/components/form/FormHeader';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { CommonWrapper, ButtonGroup } from '../Common';
import { ArrowUpRightIcon, LottoPGFIcon, ZuPassIcon } from '@/components/icons';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRegAndAccess } from '@/services/event/regAndAccess';
import { RegistrationAndAccess } from '@/types';
import { useParams } from 'next/navigation';
import { ZuButton } from '@/components/core';

interface FormProps {
  regAndAccess?: RegistrationAndAccess;
  onClose: () => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  contractAddress: yup.string().required('Contract Address is required'),
});

export default function Form({ onClose, regAndAccess }: FormProps) {
  const lottoInfo = regAndAccess?.zuLottoInfo?.[0];
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    values: {
      name: lottoInfo?.name ?? '',
      description: lottoInfo?.description ?? '',
      contractAddress: lottoInfo?.contractAddress ?? '',
    },
  });

  const queryClient = useQueryClient();
  const pathname = useParams();
  const eventId = pathname.eventid.toString();
  const updateMutation = useMutation({
    mutationFn: updateRegAndAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetchEventById'],
      });
      reset();
      onClose();
    },
  });
  const isLoading = updateMutation.isPending;

  const onSubmit = useCallback(
    (data: yup.InferType<typeof schema>) => {
      updateMutation.mutate({
        type: 'zuLotto',
        id: regAndAccess?.id || '',
        eventId,
        zuLottoInfo: {
          name: data.name,
          description: data.description,
          contractAddress: data.contractAddress,
        },
      });
    },
    [eventId, regAndAccess?.id, updateMutation],
  );

  return (
    <Box>
      <FormHeader title="Configure Zupass" handleClose={onClose} />
      <Stack padding="20px" spacing="20px">
        <Stack spacing="10px">
          <Typography
            fontSize={20}
            fontWeight={700}
            lineHeight={1.2}
            sx={{ opacity: 0.7 }}
          >
            Ticketing Setup
          </Typography>
          <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.6 }}>
            Configure ZuLotto Ticketing
          </Typography>
          <Stack
            spacing="10px"
            p="4px 10px"
            borderRadius="6px"
            bgcolor="rgba(255, 255, 255, 0.05)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            direction="row"
            alignItems="center"
            display="inline-flex"
            width="fit-content"
          >
            <Typography fontSize={10} lineHeight={1.2} sx={{ opacity: 0.6 }}>
              Registration Method:
            </Typography>
            <Box display="flex" alignItems="center" gap="4px">
              <LottoPGFIcon size={3.5} />
              <Typography fontSize={14} lineHeight={1.2}>
                ZuLotto
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <CommonWrapper>
          <Stack spacing="20px">
            <ZuButton
              startIcon={<ArrowUpRightIcon size={5} />}
              sx={{
                border: '1px solid rgba(103, 219, 255, 0.20)',
                borderRadius: '10px',
                backgroundColor: 'rgba(103, 219, 255, 0.10)',
                p: '8px 14px',
                gap: '10px',
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: 1.6,
                color: '#67DBFF',
                width: '100%',
              }}
              onClick={() => {
                window.open('https://lottopgf.org/', '_blank');
              }}
            >
              Generate an event at LottoPGF
            </ZuButton>
            <Stack spacing="10px">
              <Typography fontSize={16} fontWeight={700} lineHeight={1.6}>
                ZuLotto Contract Address
              </Typography>
              <Controller
                name="contractAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    // placeholder="e.g. 1ebfb9...e75003,10ec38...b7d204"
                    error={!!errors.contractAddress}
                    helperText={errors.contractAddress?.message}
                  />
                )}
              />
            </Stack>
            <Stack spacing="10px">
              <Typography fontSize={16} fontWeight={700} lineHeight={1.6}>
                Lottery Name
              </Typography>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    // placeholder="e.g. 6f5f194b-xxxx-xxxx-xxxx-0998f3eacc75"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Stack>
            <Stack spacing="10px">
              <Typography fontSize={16} fontWeight={700} lineHeight={1.6}>
                Ticket Description
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    // placeholder="e.g. ZuVillage Georgia"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Stack>
          </Stack>
        </CommonWrapper>
        <ButtonGroup
          isBackButton={false}
          isConfirmButton
          isLoading={isLoading}
          handleNext={handleSubmit(onSubmit)}
          handleBack={onClose}
        />
      </Stack>
    </Box>
  );
}
