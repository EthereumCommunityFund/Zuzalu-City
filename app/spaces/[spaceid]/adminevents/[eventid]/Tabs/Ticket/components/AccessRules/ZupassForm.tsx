import FormHeader from '@/components/form/FormHeader';
import ClockIcon from '@/components/icons/Clock';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { CommonWrapper, TitleWithTag, ButtonGroup } from '../Common';
import { ZuButton, ZuSwitch } from '@/components/core';
import { PlusIcon, XCricleIcon } from '@/components/icons';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';

interface FormProps {
  ids: string[];
  onClose: () => void;
}

const schema = yup.object().shape({
  ids: yup.array().of(
    yup.object().shape({
      id: yup.string().required('Ticket ID is required'),
    }),
  ),
  allowAll: yup.boolean(),
});

export default function ZupassForm({ ids = [''], onClose }: FormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    values: {
      ids: ids.map((id) => ({ id })),
      allowAll: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ids',
  });

  const onSubmit = useCallback((data: any) => {
    console.log('submit', data);
  }, []);

  return (
    <Box>
      <FormHeader title="Access Rules" handleClose={onClose} />
      <Stack padding="20px" spacing="20px">
        <TitleWithTag
          required={false}
          opacity={0.7}
          leftIcon={<ClockIcon size={6} opacity={0.5} />}
          title="Event Schedule Access"
          desc="Select which ticket type from Zupass for access to this app"
        />
        <Stack
          direction="row"
          alignItems="center"
          spacing="14px"
          bgcolor="rgba(255, 255, 255, 0.05)"
          borderRadius="10px"
          p="10px"
        >
          <Controller
            name="allowAll"
            control={control}
            render={({ field }) => (
              <ZuSwitch width={40} height={20} checked={field.value} {...field} />
            )}
          />
          <Typography
            fontSize={14}
            fontWeight={600}
            lineHeight={1.6}
            sx={{ opacity: 0.8 }}
          >
            Allow all ticket types
          </Typography>
        </Stack>
        <CommonWrapper>
          <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.6 }}>
            Input ticket IDs to allow access to this app
          </Typography>
          <Stack spacing={2}>
            {fields.map((field, index) => (
              <Stack key={field.id} spacing="10px">
                <Typography fontSize={16} fontWeight={700} lineHeight={1.2}>
                  TicketTypeID
                </Typography>
                <Stack direction="row" spacing="10px" alignItems="center">
                  <Controller
                    name={`ids.${index}.id`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        error={!!errors.ids?.[index]?.id}
                        helperText={errors.ids?.[index]?.id?.message}
                      />
                    )}
                  />
                  <IconButton onClick={() => remove(index)}>
                    <XCricleIcon size={6} color="rgba(255, 255, 255, 0.5)" />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
            <ZuButton
              startIcon={<PlusIcon size={4} />}
              sx={{ width: '100%', p: '10px', fontWeight: 600 }}
              onClick={() => append({ id: '' })}
            >
              Add a Ticket
            </ZuButton>
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
