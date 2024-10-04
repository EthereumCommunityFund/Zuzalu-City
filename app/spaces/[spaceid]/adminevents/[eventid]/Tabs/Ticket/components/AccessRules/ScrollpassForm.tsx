import FormHeader from '@/components/form/FormHeader';
import { Box, Button, Stack, Typography } from '@mui/material';
import { CommonWrapper, ButtonGroup, RoundCheckbox } from '../Common';
import { ScrollIcon, ScrollPassIcon } from '@/components/icons';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import Image from 'next/image';

interface FormProps {
  ids: string[];
  onClose: () => void;
}

const schema = yup.object().shape({
  ids: yup.array().of(
    yup.object().shape({
      id: yup.string(),
    }),
  ),
});

export default function ScrollpassForm({ ids = [''], onClose }: FormProps) {
  const { handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    values: {
      ids: ids.map((id) => ({ id })),
    },
  });

  const selectedIds = watch('ids') || [];

  const tickets = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index.toString(),
      })),
    [],
  );

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
        tickets.map((ticket) => ({ id: ticket.id })),
      );
    }
  }, [selectedIds.length, tickets, setValue]);

  const onSubmit = useCallback((data: any) => {
    console.log('submit', data);
  }, []);

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
              const isSelected = selectedIds.some((id) => id.id === item.id);
              return (
                <Stack
                  key={item.id}
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
                  onClick={() => toggleTicketSelection(item.id)}
                >
                  <Image
                    src="/images/ticket-image.png"
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
                        Ticket ID
                      </Typography>
                      <RoundCheckbox checked={isSelected} />
                    </Stack>
                    <Typography
                      fontSize={10}
                      lineHeight={1.2}
                      sx={{ opacity: 0.6 }}
                    >
                      Ticket Address: 0x00000...000000
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
          handleNext={handleSubmit(onSubmit)}
          handleBack={onClose}
        />
      </Stack>
    </Box>
  );
}
