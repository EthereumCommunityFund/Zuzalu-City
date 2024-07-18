import * as React from 'react';
import { Stack, Typography, useTheme } from '@mui/material';
import { ZuButton } from '@/components/core';
import { PlusCircleIcon, PlusIcon } from 'components/icons';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Anchor } from '@/types';

interface SessionHeaderProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
  sessionAmount?: number;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  onToggle = (anchor: Anchor, open: boolean) => {},
  sessionAmount = 0,
}) => {
  const { breakpoints } = useTheme();

  return (
    <Stack direction={'column'} spacing={3}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant="h5">Event Schedule</Typography>
        {sessionAmount > 0 && (
          <ZuButton
            startIcon={<PlusIcon />}
            onClick={() => onToggle('right', true)}
          >
            Add a Session
          </ZuButton>
        )}
      </Stack>
      {sessionAmount === 0 && (
        <Stack
          direction={'row'}
          spacing={2}
          sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.10)' }}
          paddingBottom={'20px'}
        >
          <Stack
            direction="row"
            alignItems="center"
            bgcolor="#383838"
            borderRadius={2}
            padding="5px 10px"
            spacing={1}
            flex={1}
            onClick={() => onToggle('right', true)}
            sx={{
              cursor: 'pointer',
            }}
          >
            <PlusCircleIcon />
            <Stack>
              <Typography variant="subtitle2" color="white">
                Add a session
              </Typography>
              <Typography variant="caption" color="white">
                Add a Session to the Schedule
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            bgcolor="#383838"
            borderRadius={2}
            padding="5px 10px"
            spacing={1}
            flex={1}
            sx={{
              cursor: 'pointer',
            }}
          >
            <PersonAddAlt1Icon />
            <Stack>
              <Typography variant="subtitle2" color="white">
                Invite Editors
              </Typography>
              <Typography variant="caption" color="white">
                Invite People to create & edit sessions for this event
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default SessionHeader;
