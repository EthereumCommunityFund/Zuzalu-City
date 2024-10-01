import { Box, Stack, Typography } from '@mui/material';
import { StatusIndicatorPanel } from '../Common';

interface StatusProps {
  title: string;
  desc: string;
  unavailableDesc: string;
}

const RegistrationStatus = () => {
  return (
    <Stack>
      <Stack alignItems="center" direction="row" gap="10px">
        <Stack alignItems="flex-start" flexDirection="row" gap="10px">
          <Typography
            fontSize={20}
            fontWeight={700}
            lineHeight={1.2}
            color="#FF9C66"
          >
            *
          </Typography>
          <Typography fontSize={20} fontWeight={700} lineHeight={1.2}>
            Registration Status
          </Typography>
        </Stack>
      </Stack>
      <Typography
        mt="10px"
        fontSize={14}
        lineHeight={1.6}
        sx={{ opacity: 0.8 }}
      >
        Open or close registration on your event page
      </Typography>
      <Box mt="20px">
        <StatusIndicatorPanel name="Unavailable" checked={false} disabled />
      </Box>
    </Stack>
  );
};

export { RegistrationStatus };
