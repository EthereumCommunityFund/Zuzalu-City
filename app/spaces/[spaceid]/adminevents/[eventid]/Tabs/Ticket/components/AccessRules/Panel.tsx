import { Stack, Typography } from '@mui/material';
import { TitleWithTag } from '../Common';
import ClockIcon from '@/components/icons/Clock';
import { ZuSwitch } from '@/components/core';
import { BuildStoreFrontIcon } from '@/components/icons';

interface PanelProps {
  handleOpen: () => void;
}

export default function Panel({ handleOpen }: PanelProps) {
  return (
    <Stack spacing="10px">
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
      <Stack
        p="10px"
        bgcolor="rgba(255, 255, 255, 0.02)"
        borderRadius="10px"
        spacing="5px"
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing="10px"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing="10px">
            <BuildStoreFrontIcon size={6} />
            <Typography
              fontSize={18}
              fontWeight={700}
              lineHeight={1.2}
              sx={{ opacity: 0.8 }}
            >
              Event Shop (e-commerce)
            </Typography>
          </Stack>
          <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
            COMING SOON
          </Typography>
        </Stack>
        <Typography fontSize={10} lineHeight={1.2} sx={{ opacity: 0.5 }}>
          Powered By: AAStar
        </Typography>
      </Stack>
      <Typography
        pl="10px"
        fontSize={13}
        lineHeight={1.4}
        sx={{ opacity: 0.5 }}
      >
        More apps coming soon!
      </Typography>
    </Stack>
  );
}
