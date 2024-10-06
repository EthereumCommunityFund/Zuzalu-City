import { Box, Stack } from '@mui/material';
import { StatusIndicatorPanel, TitleWithTag } from '../Common';
import { RegistrationAndAccess, Event } from '@/types';
import { useMemo } from 'react';
import { RegistrationAccess, TagProps } from '../types';
import useRegAndAccess from '@/hooks/useRegAndAccess';
import useOpenDraw from '@/hooks/useOpenDraw';
import Drawer from '@/components/drawer';
import Form from './Form';

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
  const { handleOpen, handleClose, open } = useOpenDraw();

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
    <>
      <Stack>
        <TitleWithTag
          tags={tags}
          title="Event Registration"
          desc="Open or close registration on your event page"
          required={!isOpen}
          buttonText={
            regAndAccess?.registrationAccess === RegistrationAccess.Whitelist
              ? 'Open Whitelist'
              : undefined
          }
          onClick={handleOpen}
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
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        <Form onClose={handleClose} regAndAccess={regAndAccess} />
      </Drawer>
    </>
  );
};

export { RegistrationStatus };
