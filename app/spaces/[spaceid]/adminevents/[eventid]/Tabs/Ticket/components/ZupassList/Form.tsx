import FormHeader from '@/components/form/FormHeader';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { CommonWrapper, ButtonGroup } from '../Common';
import { ZuPassIcon } from '@/components/icons';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';

interface FormProps {
  onClose: () => void;
}

const schema = yup.object().shape({
  publicKey: yup.string().required('Public Key is required'),
  eventId: yup.string().required('Event ID is required'),
  eventName: yup.string().required('Event Name is required'),
});

export default function Form({ onClose }: FormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    values: {
      publicKey: '',
      eventId: '',
      eventName: '',
    },
  });

  const onSubmit = useCallback((data: any) => {
    console.log('submit', data);
  }, []);

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
            Configure Zupass Ticketing
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
              <ZuPassIcon size={3.5} />
              <Typography fontSize={14} lineHeight={1.2}>
                ZuPass
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <CommonWrapper>
          <Stack spacing="20px">
            <Stack spacing="10px">
              <Stack spacing="6px">
                <Typography fontSize={16} fontWeight={700} lineHeight={1.6}>
                  ZuPass Public Key
                </Typography>
                <Typography fontSize={13} lineHeight={1.4}>
                  For multiple keys, use comma for separation
                </Typography>
              </Stack>
              <Controller
                name="publicKey"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.publicKey}
                    helperText={errors.publicKey?.message}
                  />
                )}
              />
            </Stack>
            <Stack spacing="10px">
              <Typography fontSize={16} fontWeight={700} lineHeight={1.6}>
                Event ID
              </Typography>
              <Controller
                name="eventId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.eventId}
                    helperText={errors.eventId?.message}
                  />
                )}
              />
            </Stack>
            <Stack spacing="10px">
              <Typography fontSize={16} fontWeight={700} lineHeight={1.6}>
                Event Name
              </Typography>
              <Controller
                name="eventName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.eventName}
                    helperText={errors.eventName?.message}
                  />
                )}
              />
            </Stack>
          </Stack>
        </CommonWrapper>
        <ButtonGroup
          isBackButton={false}
          isConfirmButton
          handleNext={handleSubmit(onSubmit)}
          handleBack={onClose}
        />
      </Stack>
    </Box>
  );
}
