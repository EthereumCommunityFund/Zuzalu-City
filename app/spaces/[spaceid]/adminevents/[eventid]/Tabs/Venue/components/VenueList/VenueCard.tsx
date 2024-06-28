import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ThreeVerticalIcon } from '@/components/icons';
import { Venue } from '@/types';

type VenueCardProps = {
  venue: Venue;
};

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  return (
    <Stack
      direction="row"
      spacing="14px"
      padding="10px"
      borderRadius={'10px'}
      border="1px solid rgba(255, 255, 255, 0.06)"
      bgcolor="#2d2d2d"
      sx={{
        ':hover': {
          backgroundColor: '#383838',
        },
      }}
    >
      <Box
        component="img"
        width="40px"
        height="40px"
        borderRadius="6px"
        src={venue.avatar || "/7.jpg"}
      />
      <Stack spacing="10px" flex="1">
        <Typography variant="bodyBB">{venue.name}</Typography>
        <Stack direction="row" spacing="10px">
          {
            venue.tags.split(',').map((item, i) => (
              <Stack bgcolor="#424242" padding="3px 8px" borderRadius="4px" key={`Venue_Label${i}`}>
                <Typography variant="caption">{item}</Typography>
              </Stack>
            ))
          }
        </Stack>
        <Typography variant="bodyS">Sessions Booked: Capacity: 00</Typography>
      </Stack>
      <Stack
        direction="row"
        padding="10px"
        alignItems="center"
        bgcolor="#383838"
        borderRadius="6px"
        height="fit-content"
      >
        <ThreeVerticalIcon size={5} />
      </Stack>
    </Stack>
  );
};

export default VenueCard;
