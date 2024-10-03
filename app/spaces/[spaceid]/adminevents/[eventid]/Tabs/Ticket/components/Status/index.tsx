import { Box, Stack, Typography } from '@mui/material';
import { StatusIndicatorPanel, Tag, TitleWithTag } from '../Common';
import { Event } from '@/types';

interface StatusProps {
  event: Event;
  title: string;
  desc: string;
  unavailableDesc: string;
}

const RegistrationStatus = () => {
  // const registrationAccess = event?.registrationAccess;

  return (
    <Stack>
      <TitleWithTag
        tags={[
          {
            type: 'text',
            text: 'Setting: Open-to-All',
          },
          {
            type: 'required',
            text: 'Requires completed SETUP',
          },
        ]}
        title="Event Registration"
        desc="Open or close registration on your event page"
      />
      <Box mt="20px">
        <StatusIndicatorPanel name="Unavailable" checked={false} disabled />
      </Box>
    </Stack>
  );
};

export { RegistrationStatus };
