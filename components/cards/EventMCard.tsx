'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Typography, Button, BoxProps } from '@mui/material';
import {
  EyeIcon,
  EventIcon,
  ThreeVerticalIcon,
  EyeSlashIcon,
  ArchiveIcon,
} from '../icons';
import { Event } from '@/types';

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

const MonthKeys = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatDateToMonth = (t: string) => {
  const date = new Date(t);
  return MonthKeys[date.getMonth()] + ' ' + date.getFullYear();
};

function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

interface EventMCardProps extends BoxProps {
  event: Event;
  type?: number;
  applicants?: number;
  isSideEventActive?: boolean;
}

const EventMCard: React.FC<EventMCardProps> = ({
  event,
  type = 0,
  applicants = 0,
  isSideEventActive = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="10px"
      padding="10px"
      borderRadius="10px"
      border="1px solid #383838"
      bgcolor="#2D2D2D"
      sx={{ cursor: 'pointer' }}
      onClick={() => router.push(`${pathname}/${event.id}`)}
    >
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap="10px">
          <Typography
            fontFamily="Inter"
            fontSize="24px"
            color="white"
            fontWeight={700}
          >
            {event.title}
          </Typography>
          <Typography
            fontFamily="Inter"
            fontSize="14px"
            color="white"
            sx={{ opacity: 0.5 }}
          >
            {formatDateToMonth(event.startTime)} -{' '}
            {formatDateToMonth(event.endTime)}
          </Typography>
        </Box>
        <Button
          startIcon={<ThreeVerticalIcon />}
          sx={{
            padding: 0,
            minWidth: 0,
            borderRadius: '10px',
            backgroundColor: '#404040',
            height: '30px',
            width: '30px',
            '& .MuiButton-startIcon': {
              margin: 0,
            },
          }}
        />
      </Box>
      <Typography
        fontFamily="Inter"
        fontSize="16px"
        color="white"
        sx={{ opacity: 0.7 }}
      >
        {/* {event.description} */}
        {event.description === null && 'NULL'}
        {event.description !== null &&
          !isValidJSON(event.description.replaceAll('\\"', '"')) &&
          event.description}
        {event.description === null ||
        !isValidJSON(event.description.replaceAll('\\"', '"')) ||
        JSON.parse(event.description.replaceAll('\\"', '"')).blocks[0] ===
          undefined
          ? 'JSON ERROR'
          : JSON.parse(event.description.replaceAll('\\"', '"')).blocks[0].data
              .text}
      </Typography>
      <Box display="flex" alignItems="center" gap="10px">
        <Button
          startIcon={EVENT_TYPE[type].icon}
          sx={{
            borderRadius: '10px',
            backgroundColor: EVENT_TYPE[type].bgColor,
            fontFamily: 'Inter',
            fontSize: '13px',
            color: EVENT_TYPE[type].color,
            textTransform: 'none',
            opacity: 0.7,
            padding: '4px 10px',
          }}
        >
          {EVENT_TYPE[type].category}
        </Button>
        {isSideEventActive && (
          <Button
            startIcon={<EventIcon />}
            sx={{
              borderRadius: '10px',
              backgroundColor: '#4A4A4A',
              fontFamily: 'Inter',
              fontSize: '13px',
              color: 'white',
              textTransform: 'none',
              opacity: 0.7,
            }}
          >
            Side Events Active
          </Button>
        )}
        <Typography
          fontFamily="Inter"
          fontSize="14px"
          color="white"
          sx={{ opacity: 0.7 }}
        >
          Applied: {applicants}
        </Typography>
      </Box>
    </Box>
  );
};

export default EventMCard;
