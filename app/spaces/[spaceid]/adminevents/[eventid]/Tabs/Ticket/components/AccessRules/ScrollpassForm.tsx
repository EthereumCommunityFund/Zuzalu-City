import FormHeader from '@/components/form/FormHeader';
import { Box, Button, Stack, Typography } from '@mui/material';
import { CommonWrapper, ButtonGroup, RoundCheckbox } from '../Common';
import { ScrollIcon, ScrollPassIcon } from '@/components/icons';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import Image from 'next/image';
import { RegistrationAndAccess } from '@/types';
import { shortenAddress } from '@/utils/format';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRegAndAccess } from '@/services/event/regAndAccess';
import { useParams } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';

interface FormProps {
  ticketAddresses: Array<string>;
  onClose: () => void;
  regAndAccess?: RegistrationAndAccess;
}

const schema = yup.object().shape({
  ids: yup.array().of(
    yup.object().shape({
      id: yup.string(),
    }),
  ),
});

export default function ScrollpassForm({ onClose, regAndAccess }: FormProps) {
  const { handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    values: {
      ids: regAndAccess?.scrollPassTickets
        ?.filter((ticket) => ticket.checkin === '1')
        .map((ticket) => ({ id: ticket.contractAddress })),
    },
  });

  const tickets = regAndAccess?.scrollPassTickets ?? [];

  const selectedIds = watch('ids') || [];

  const queryClient = useQueryClient();
  const pathname = useParams();
  const { profile } = useCeramicContext();
  const profileId = profile?.id || '';
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

  const toggleTicketSelection = useCallback(
    (ticketId: string) => {
      setValue(
        'ids',
        selectedIds.some((selectedId) => selectedId.id === ticketId)
          ? selectedIds.filter((selectedId) => selectedId.id !== ticketId)
          : [...selectedIds, { id: ticketId }],
      );
    },
    [selectedIds, setValue],
  );

  const toggleAllTickets = useCallback(() => {
    if (selectedIds.length === tickets.length) {
      setValue('ids', []);
    } else {
      setValue(
        'ids',
        tickets.map((ticket) => ({ id: ticket.contractAddress })),
      );
    }
  }, [selectedIds.length, tickets, setValue]);

  const onSubmit = useCallback(
    (data: any) => {
      const ids = data.ids.map((id: any) => id.id);
      const scrollPassTickets = regAndAccess?.scrollPassTickets ?? [];
      scrollPassTickets.map((ticket) => {
        if (ids.includes(ticket.contractAddress)) {
          ticket.checkin = '1';
        } else {
          ticket.checkin = '0';
        }
      });
      updateMutation.mutate({
        type: 'scrollpass',
        id: regAndAccess?.id || '',
        scrollPassTickets,
        profileId,
        eventId,
      });
    },
    [
      eventId,
      profileId,
      regAndAccess?.id,
      regAndAccess?.scrollPassTickets,
      updateMutation,
    ],
  );

  return (
    <Box>
      <FormHeader title="Configure Check-In" handleClose={onClose} />
      <Stack padding="20px" spacing="20px">
        <Stack spacing="10px">
          <Typography
            fontSize={20}
            fontWeight={700}
            lineHeight={1.2}
            sx={{ opacity: 0.7 }}
          >
            Setup Method for Checking In
          </Typography>
          <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.6 }}>
            Select a method or credential for attendees to check-in to the event
          </Typography>
        </Stack>
        <CommonWrapper>
          <Stack spacing="10px">
            <Stack spacing="10px" direction="row" alignItems="center">
              <ScrollPassIcon size={5} />
              <Typography fontSize={16} lineHeight={1.6}>
                Scrollpass Tickets
              </Typography>
            </Stack>
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.6 }}>
              Choose which tickets to allow for checking in
            </Typography>
          </Stack>
          <Stack spacing="10px">
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
                {selectedIds.length === tickets.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
            </Box>
            {tickets.map((item) => {
              const isSelected = selectedIds.some(
                (id) => id.id === item.contractAddress,
              );
              return (
                <Stack
                  key={item.contractAddress}
                  p="10px"
                  borderRadius="10px"
                  bgcolor={
                    isSelected
                      ? 'rgba(125, 255, 209, 0.10)'
                      : 'rgba(255, 255, 255, 0.02)'
                  }
                  border="1px solid rgba(255, 255, 255, 0.10)"
                  direction="row"
                  alignItems="center"
                  spacing="10px"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => toggleTicketSelection(item.contractAddress)}
                >
                  <Image
                    src={item.image_url || '/24.webp'}
                    alt="ticket"
                    width={60}
                    height={60}
                    style={{
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                    }}
                  />
                  <Stack spacing="10px" flex={1}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Typography
                        fontSize={14}
                        lineHeight={1.6}
                        sx={{ opacity: 0.6 }}
                      >
                        {item.description}
                      </Typography>
                      <RoundCheckbox checked={isSelected} />
                    </Stack>
                    <Typography
                      fontSize={10}
                      lineHeight={1.2}
                      sx={{ opacity: 0.6 }}
                    >
                      Ticket Address: {shortenAddress(item.contractAddress)}
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
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
