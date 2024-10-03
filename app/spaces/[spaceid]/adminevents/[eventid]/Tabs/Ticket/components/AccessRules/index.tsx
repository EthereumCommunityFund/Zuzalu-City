import { Box, Stack, Typography } from '@mui/material';
import { TitleWithTag } from '../Common';
import ClockIcon from '@/components/icons/Clock';
import { ZuSwitch } from '@/components/core';
import useOpenDraw from '@/hooks/useOpenDraw';
import Form from './Form';
import Drawer from '@/components/drawer';

export default function AccessRules() {
  const { open, handleOpen, handleClose } = useOpenDraw();
  const isAvailable = true;
  return (
    <Stack spacing="20px">
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        <Form onClose={handleClose} />
      </Drawer>
      <TitleWithTag
        title="Access Rules"
        desc="Select which tickets will have access to the event’s apps"
        tags={[{ type: 'required', text: 'Requires Tickets' }]}
      />
      {isAvailable ? (
        <Stack
          p="10px"
          bgcolor="rgba(255, 255, 255, 0.05)"
          borderRadius="10px"
          spacing="20px"
        >
          <TitleWithTag
            required={false}
            opacity={0.8}
            leftIcon={<ClockIcon size={6} opacity={0.5} />}
            title="Event Schedule Access"
            desc="Choose which tickets/credentials can have access to this app"
            tags={[
              {
                type: 'text',
                text: 'OPEN',
                bgColor: 'rgba(125, 255, 209, 0.10)',
                textColor: '#7DFFD1',
              },
            ]}
            buttonText="Configure"
            onClick={handleOpen}
          />
          <Stack direction="row" alignItems="center" spacing="14px">
            <ZuSwitch width={40} height={20} />
            <Typography
              fontSize={14}
              fontWeight={600}
              lineHeight={1.6}
              sx={{ opacity: 0.8 }}
            >
              Enable Attendee Check-in for this app
            </Typography>
          </Stack>
        </Stack>
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
