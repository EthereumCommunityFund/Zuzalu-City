import FormHeader from '@/components/form/FormHeader';
import ClockIcon from '@/components/icons/Clock';
import { Box, Button, Stack, Typography } from '@mui/material';
import {
  CommonWrapper,
  TitleWithTag,
  ButtonGroup,
  RoundCheckbox,
} from '../Common';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import { RegistrationAndAccess } from '@/types';
import { shortenAddress } from '@/utils/format';
import { updateRegAndAccess } from '@/services/event/regAndAccess';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface FormProps {
  regAndAccess?: RegistrationAndAccess;
  onClose: () => void;
}

const schema = yup.object().shape({
  ids: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required('Ticket ID is required'),
      }),
    )
    .required(),
});

export default function ZupassForm({ regAndAccess, onClose }: FormProps) {
  const zuPassInfo = regAndAccess?.zuPassInfo?.[0];
  const list = useMemo(
    () => zuPassInfo?.registration?.split(',') ?? [],
    [zuPassInfo],
  );
  const {
    handleSubmit,
    control,
    watch,
    formState: { isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    values: {
      ids: list
        .filter((item) => zuPassInfo?.access?.split(',').includes(item))
        .map((id) => ({ id })),
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
      onClose();
    },
  });
  const isLoading = updateMutation.isPending;

  const { fields, replace } = useFieldArray({
    control,
    name: 'ids',
  });
  const ids = watch('ids');

  const toggleAllTickets = useCallback(() => {
    if (fields.length === list.length) {
      replace([]);
    } else {
      replace(list.map((id) => ({ id })));
    }
  }, [fields.length, list, replace]);

  const toggleTicketSelection = useCallback(
    (ticketId: string) => {
      replace(
        ids.some((selectedId) => selectedId.id === ticketId)
          ? ids.filter((selectedId) => selectedId.id !== ticketId)
          : [...ids, { id: ticketId }],
      );
    },
    [ids, replace],
  );

  const onSubmit = useCallback(
    (data: any) => {
      const ids = data.ids.map((id: any) => id.id);
      updateMutation.mutate({
        type: 'zuPass',
        id: regAndAccess?.id || '',
        zuPassInfo: {
          ...zuPassInfo!,
          access: ids.join(',').length > 0 ? ids.join(',') : undefined,
        },
        eventId,
      });
    },
    [eventId, regAndAccess?.id, updateMutation, zuPassInfo],
  );

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
        <CommonWrapper>
          <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.6 }}>
            Input ticket IDs to allow access to this app
          </Typography>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="right">
              <Button
                variant="text"
                sx={{
                  p: 0,
                  fontSize: '13px',
                  color: '#fff',
                  opacity: '0.6',
                  lineHeight: 1.6,
                }}
                onClick={toggleAllTickets}
              >
                {fields.length === list.length ? 'Deselect All' : 'Select All'}
              </Button>
            </Box>
            {list.map((id, index) => (
              <Stack
                key={index}
                p="10px"
                spacing="10px"
                borderRadius="10px"
                border="1px solid rgba(255, 255, 255, 0.1)"
                bgcolor="rgba(255, 255, 255, 0.02)"
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ cursor: 'pointer' }}
                onClick={() => toggleTicketSelection(id)}
              >
                <Typography
                  fontSize={16}
                  lineHeight={1.6}
                  sx={{ opacity: 0.8 }}
                >
                  {shortenAddress(id, 10)}
                </Typography>
                <RoundCheckbox checked={ids.some((item) => item.id === id)} />
              </Stack>
            ))}
          </Stack>
        </CommonWrapper>
        <ButtonGroup
          isBackButton={false}
          isConfirmButton
          isLoading={isLoading}
          isDisabled={!isDirty}
          handleNext={handleSubmit(onSubmit)}
          handleBack={onClose}
        />
      </Stack>
    </Box>
  );
}
