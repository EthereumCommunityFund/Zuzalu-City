import { Box, Stack, Typography } from '@mui/material';
import { TitleWithTag } from '../Common';
import useOpenDraw from '@/hooks/useOpenDraw';
import ZupassForm from './ZupassForm';
import Drawer from '@/components/drawer';
import Panel from './Panel';
import { Event } from '@/types';
import ScrollpassForm from './ScrollpassForm';

interface AccessRulesProps {
  event?: Event;
  type: 'zupass' | 'scrollpass';
}

export default function AccessRules({
  event,
  type = 'zupass',
}: AccessRulesProps) {
  const { open, handleOpen, handleClose } = useOpenDraw();
  const isAvailable = true;
  return (
    <Stack spacing="20px">
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        {type === 'zupass' ? (
          <ZupassForm onClose={handleClose} ids={[]} />
        ) : (
          <ScrollpassForm onClose={handleClose} ids={[]} />
        )}
      </Drawer>
      <TitleWithTag
        title="Access Rules"
        desc="Select which tickets will have access to the event’s apps"
        tags={[{ type: 'required', text: 'Requires Tickets' }]}
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
