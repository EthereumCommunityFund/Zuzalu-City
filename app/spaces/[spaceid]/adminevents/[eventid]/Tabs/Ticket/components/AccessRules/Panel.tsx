import { Stack, Typography } from '@mui/material';
import {
  StatusIndicatorPanel,
  TitleWithTag,
  useStatusContext,
} from '../Common';
import ClockIcon from '@/components/icons/Clock';
import { BuildStoreFrontIcon } from '@/components/icons';
import useRegAndAccess from '@/hooks/useRegAndAccess';
import { RegistrationAndAccess } from '@/types';

interface PanelProps {
  regAndAccess?: RegistrationAndAccess;
  handleOpen: () => void;
}

export default function Panel({ handleOpen, regAndAccess }: PanelProps) {
  const { showAccessRuleCheckin, handleCheckinOpenChange } = useRegAndAccess({
    regAndAccess,
  });
  const { status } = useStatusContext();
  const checked = status.checkinOpen;

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
          buttonText="Configure"
          onClick={handleOpen}
        />
        {showAccessRuleCheckin && (
          <Stack direction="row" alignItems="center" spacing="14px">
            <StatusIndicatorPanel
              name="Enable Attendee Check-in for this app"
              checked={!!checked}
              noWrapper
              onChange={handleCheckinOpenChange}
            />
          </Stack>
        )}
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
