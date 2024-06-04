import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { PlusCircleIcon } from 'components/icons';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface SessionHeaderProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  onToggle = (anchor: Anchor, open: boolean) => {},
}) => {
  return (
    <Stack direction={'column'} spacing={3}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant="h5">Your Sessions</Typography>
        <Typography variant="body2">Total Sessions: 89</Typography>
      </Stack>
      <Stack direction={'row'} spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          bgcolor="#383838"
          borderRadius={2}
          padding="5px 10px"
          spacing={1}
          flex={1}
          onClick={() => onToggle('right', true)}
          sx={{ cursor: 'pointer' }}
        >
          <PlusCircleIcon />
          <Stack>
            <Typography variant="subtitle2" color="white">
              Create Session
            </Typography>
            <Typography variant="caption" color="white">
              Add sessions for this even
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
          onClick={() => onToggle('right', true)}
        >
          <PlusCircleIcon />
          <Stack>
            <Typography variant="subtitle2" color="white">
              Invite Editors
            </Typography>
            <Typography variant="caption" color="white">
              Invite people to create & edit sessions
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SessionHeader;
