import * as React from 'react';
import { Stack, Typography, useTheme } from '@mui/material';
import { GroupIcon, NewspaperIcon, PlusCircleIcon } from 'components/icons';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface SessionHeaderProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
  count: number;
}

const VenueHeader: React.FC<SessionHeaderProps> = ({
  onToggle = (anchor: Anchor, open: boolean) => {},
  count = 0,
}) => {
  const { breakpoints } = useTheme();

  return (
    <Stack
      direction={'column'}
      spacing={3}
      pb="30px"
      borderBottom="1px solid #313131"
    >
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant="h5">Announcements</Typography>
        <Stack direction="row">
          <Typography variant="body1" color="white">
            Today&apos;s Date:&nbsp;
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.7 }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VenueHeader;
