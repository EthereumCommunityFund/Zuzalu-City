import { Box, Stack, Typography } from '@mui/material';
import { TitleWithTag } from '../Common';
import useOpenDraw from '@/hooks/useOpenDraw';
import ZupassForm from './ZupassForm';
import Drawer from '@/components/drawer';
import Panel from './Panel';
import { Event, RegistrationAndAccess } from '@/types';
import ScrollpassForm from './ScrollpassForm';
import { useMemo } from 'react';
import { TagProps } from '../types';

interface AccessRulesProps {
  regAndAccess?: RegistrationAndAccess;
  event?: Event;
  type?: 'zupass' | 'scrollpass';
  isAvailable?: boolean;
  ticketAddresses: Array<string>;
}

export default function AccessRules({
  event,
  regAndAccess,
  type = 'zupass',
  isAvailable,
  ticketAddresses,
}: AccessRulesProps) {
  const { open, handleOpen, handleClose } = useOpenDraw();

  const tags = useMemo((): TagProps[] => {
    if (regAndAccess?.scrollPassTickets?.length === 0) {
      return [{ type: 'warning', text: 'Requires Tickets' }];
    }
    if (regAndAccess?.scrollPassTickets?.length) {
      const data = regAndAccess?.scrollPassTickets.filter(
        (ticket) => ticket.checkin === '1',
      );
      if (data.length === 0) {
        return [{ type: 'warning', text: 'Requires completed SETUP' }];
      }
    }
    return [];
  }, [regAndAccess?.scrollPassTickets]);

  return (
    <Stack spacing="20px">
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        {type === 'zupass' ? (
          <ZupassForm onClose={handleClose} ids={[]} />
        ) : (
          <ScrollpassForm
            regAndAccess={regAndAccess}
            onClose={handleClose}
            ticketAddresses={ticketAddresses}
          />
        )}
      </Drawer>
      <TitleWithTag
        title="Access Rules"
        desc="Select which tickets will have access to the event’s apps"
        tags={tags}
      />
      {isAvailable ? (
        <Panel handleOpen={handleOpen} />
      ) : (
        <Box p="10px" bgcolor="rgba(255, 255, 255, 0.05)" borderRadius="10px">
          <Typography
            fontSize={18}
            fontWeight={700}
            lineHeight={1.2}
            sx={{ opacity: 0.8 }}
          >
            Unavailable
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
