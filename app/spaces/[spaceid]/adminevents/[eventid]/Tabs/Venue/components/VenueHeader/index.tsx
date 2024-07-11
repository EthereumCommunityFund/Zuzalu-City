import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { GroupIcon, NewspaperIcon, PlusCircleIcon } from 'components/icons';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface SessionHeaderProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
  count: number
}

const VenueHeader: React.FC<SessionHeaderProps> = ({
  onToggle = (anchor: Anchor, open: boolean) => { },
  count = 0
}) => {
  return (
    <Stack
      direction={'column'}
      spacing={3}
      pb="30px"
      borderBottom="1px solid #313131"
    >
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant="h5">Venue Spaces</Typography>
        <Typography variant="bodyB">Total Spaces: {count}</Typography>
      </Stack>
      <Stack direction={'row'} spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          bgcolor="#383838"
          borderRadius={2}
          padding="5px 10px"
          spacing={1}
          width="50%"
          onClick={() => onToggle('right', true)}
          sx={{ cursor: 'pointer' }}
        >
          <GroupIcon />
          <Stack>
            <Typography variant="subtitle2" color="white">
              Add a Location
            </Typography>
            <Typography
              variant="caption"
              color="white"
              textTransform="uppercase"
            >
              a unit, room or location at the venue
            </Typography>
          </Stack>
        </Stack>
        {/* <Stack
          direction="row"
          alignItems="center"
          bgcolor="#383838"
          borderRadius={2}
          padding="5px 10px"
          spacing={1}
          flex={1}
        >
          <NewspaperIcon />
          <Stack>
            <Typography variant="subtitle2" color="white">
              Post Announcement
            </Typography>
            <Typography
              variant="caption"
              color="white"
              textTransform="uppercase"
            >
              COMING SOON
            </Typography>
          </Stack>
        </Stack> */}
      </Stack>
    </Stack>
  );
};

export default VenueHeader;
