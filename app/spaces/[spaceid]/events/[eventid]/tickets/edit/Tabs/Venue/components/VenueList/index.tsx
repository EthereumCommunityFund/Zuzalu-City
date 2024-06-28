import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import ZuButton from 'components/core/Button';
import { PlusIcon, PlusCircleIcon } from 'components/icons';
import { Venue } from '@/types';
import VenueCard from './VenueCard';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface VenueListProps {
  venues?: Venue[];
  onToggle: (anchor: Anchor, open: boolean) => void;
}

const VenueList: React.FC<VenueListProps> = ({ venues, onToggle }) => {
  return (
    <Stack direction="column" spacing={0.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Spaces</Typography>
        <ZuButton
          startIcon={<PlusIcon />}
          onClick={() => onToggle('right', true)}
        >
          Add a Space
        </ZuButton>
      </Stack>
      <Typography variant="body2">
        These are bookable areas at or near a venue for sessions
      </Typography>
      {venues?.length === 0 && (
        <Stack
          direction="column"
          alignItems="center"
          bgcolor="#2d2d2d"
          padding="20px 10px"
          borderRadius={2}
        >
          <PlusCircleIcon color="#6c6c6c" size={15} />
          <Typography variant="subtitle2">No Spaces</Typography>
          <Typography variant="body2">Add a Space</Typography>
        </Stack>
      )}
      {/* <Stack paddingY="20px" spacing="10px">
        {venues?.map((venue, index) => (
          <VenueCard key={`VenueCard-${index}`} title={venue.title} />
        ))}
      </Stack> */}
    </Stack>
  );
};

export default VenueList;
