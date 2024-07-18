import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ThreeVerticalIcon } from '@/components/icons';
import { VENUE_TAGS } from '@/constant';
import { formatAmount } from '@/utils';

type VenueCardProps = {
  name: string;
  avatar: string;
  bookings: string;
  tags: string;
};

const VenueCard: React.FC<VenueCardProps> = ({
  name,
  avatar,
  bookings,
  tags,
}) => {
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
        src={avatar ? avatar : '/7.jpg'}
      />
      <Stack spacing="10px" flex="1">
        <Typography variant="bodyBB">{name}</Typography>
        <Stack direction="row" spacing="10px">
          {tags.split(',').length > 0 &&
            tags.split(',').map((tag, index) => {
              return (
                <Stack
                  bgcolor="#424242"
                  padding="3px 8px"
                  borderRadius="4px"
                  key={index}
                >
                  <Typography variant="caption">
                    {
                      VENUE_TAGS.filter((tagItem) => tagItem.value === tag)[0]
                        .label
                    }
                  </Typography>
                </Stack>
              );
            })}
        </Stack>
        <Typography variant="bodyS">
          Sessions Booked: Capacity:{' '}
          {formatAmount(
            Object.values(JSON.parse(bookings)).filter(
              (value: any) => value.length > 0 && value[0].startTime,
            ).length,
            2,
          )}
        </Typography>
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
