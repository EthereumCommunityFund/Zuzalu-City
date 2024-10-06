import { Box, Stack } from '@mui/material';
import { StatusIndicatorPanel, TitleWithTag } from '../Common';
import { RegistrationAndAccess, Event } from '@/types';
import { useMemo } from 'react';
import { TagProps } from '../types';
import useRegAndAccess from '@/hooks/useRegAndAccess';

interface StatusProps {
  event?: Event;
  regAndAccess?: RegistrationAndAccess;
  isAvailable?: boolean;
}

const RegistrationStatus = ({
  isAvailable = false,
  regAndAccess,
}: StatusProps) => {
  const isOpen = regAndAccess?.registrationOpen === '1';

  const { handleRegistrationOpenChange } = useRegAndAccess({ regAndAccess });

  const tags = useMemo(() => {
    const tags: TagProps[] = [
      {
        type: 'text',
        text: `Setting: ${regAndAccess?.registrationAccess}`,
      },
    ];
    if (!isAvailable) {
      tags.push({
        type: 'warning',
        text: 'Required to open event',
      });
    }
    return tags;
  }, [isAvailable, regAndAccess?.registrationAccess]);

  return (
    <Stack>
      <TitleWithTag
        tags={tags}
        title="Event Registration"
        desc="Open or close registration on your event page"
        required={!isOpen}
      />
      <Box mt="20px">
        {!isAvailable ? (
          <StatusIndicatorPanel name="Unavailable" checked={false} disabled />
        ) : (
          <StatusIndicatorPanel
            name={isOpen ? 'Open' : 'Close'}
            desc={
              isOpen
                ? 'Registration is opened.'
                : 'Registration is closed. No one has access to register to your event'
            }
            checked={isOpen}
            onChange={handleRegistrationOpenChange}
          />
        )}
      </Box>
    </Stack>
  );
};

export { RegistrationStatus };
