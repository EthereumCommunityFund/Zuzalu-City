'use client';

import * as React from 'react';
import { Typography, Stack } from '@mui/material';
import {
  EyeIcon,
  EventIcon,
  ThreeVerticalIcon,
  EyeSlashIcon,
  ArchiveIcon,
} from 'components/icons';
import { ZuButton } from 'components/core';

const EVENT_TYPE = [
  {
    category: 'Public',
    icon: <EyeIcon color="#65C0A0" />,
    bgColor: '#384A44',
    color: '#65C0A0',
  },
  {
    category: 'Space Only',
    icon: <EyeIcon color="#65C0A0" />,
    bgColor: '#384A44',
    color: '#65C0A0',
  },
  {
    category: 'Hidden',
    icon: <EyeSlashIcon color="#C09965" />,
    bgColor: '#4A4238',
    color: '#C09965',
  },
  {
    category: 'Archived',
    icon: <ArchiveIcon color="#BEBEBE" />,
    bgColor: '#444444',
    color: '#BEBEBE',
  },
];

type EventCardProps = {
  type?: number;
  applicants?: number;
  isSideEventActive?: boolean;
};

const EventCard: React.FC<EventCardProps> = ({
  type = 0,
  applicants = 0,
  isSideEventActive = false,
}) => {
  return (
    <Stack
      direction="column"
      gap={1}
      padding={2}
      borderRadius={2}
      border="1px solid #383838"
      bgcolor="#2D2D2D"
    >
      <Stack direction='row' justifyContent="space-between">
        <Stack direction='row' alignItems="center" spacing={1}>
          <Typography
            variant='h6'
            color="white"
          >
            ZuVillage Georgia
          </Typography>
          <Typography
            variant='body2'
            color="white"
            sx={{ opacity: 0.5 }}
          >
            October 28 - November 12
          </Typography>
        </Stack>
        <ZuButton
          startIcon={<ThreeVerticalIcon />}
          sx={{
            minWidth: 0,
            padding: 0,
            '& .MuiButton-startIcon': {
              margin: 0,
            },
          }}
        />
      </Stack>
      <Typography
        variant='body1'
        color="white"
        sx={{ opacity: 0.7 }}
      >
        A Popup Village of Innovation in the Heart of Istanbul
      </Typography>
      <Stack direction='row' alignItems="center" spacing={1}>
        <ZuButton
          startIcon={EVENT_TYPE[type].icon}
          sx={{
            backgroundColor: EVENT_TYPE[type].bgColor,
            color: EVENT_TYPE[type].color,
            opacity: 0.7,
          }}
        >
          {EVENT_TYPE[type].category}
        </ZuButton>
        {isSideEventActive && (
          <ZuButton
            startIcon={<EventIcon />}
            sx={{
              backgroundColor: '#4A4A4A',
              opacity: 0.7,
            }}
          >
            Side Events Active
          </ZuButton>
        )}
        <Typography
          variant='body2'
          color="white"
          sx={{ opacity: 0.7 }}
        >
          Applied: {applicants}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default EventCard;
