'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Skeleton, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { MapIcon, LockIcon } from '../icons';
import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { dayjs } from '@/utils/dayjs';

type EventCardProps = { event: Event };

const dateNowUtc = dayjs(new Date()).utc();

export const filterPastEvents = (events: Event[]) => {
  return events.filter((event) => dayjs(event.endTime).isBefore(dateNowUtc));
};

export const filterUpcomingEvents = (events: Event[]) => {
  return events.filter((event) => {
    const now = dayjs();
    const startTime = dayjs(event.startTime);
    const endTime = dayjs(event.endTime);
    return now.isBetween(startTime, endTime) || startTime.isAfter(now);
  });
};

export const formatDateToMonth = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const formatTimestamp = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

export const groupEventsByMonth = (events: Event[]) => {
  const groupedEvents: { [key: string]: Event[] } = {};
  events.forEach((event) => {
    const month = formatDateToMonth(event.startTime);
    if (!groupedEvents[month]) {
      groupedEvents[month] = [];
    }
    groupedEvents[month].push(event);
  });
  return groupedEvents;
};

function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [eventLocation, setEventLocation] = useState<string>('Loading...');

  const getLocation = async () => {
    try {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .eq('eventId', event.id);

      if (data !== null) {
        setEventLocation(data[0].name || 'Not Available');
      } else {
        setEventLocation('Not Available');
      }
    } catch (err) {
      setEventLocation('Not Available');
    }
  };

  useEffect(() => {
    getLocation().catch((err) => console.log(err));
  }, []);

  const handleNavigation = () => {
    if (pathname !== '/') {
      router.push(`/spaces/${event.spaceId}/events/${event.id}`);
    } else router.push(`/events/${event.id}}`);
  };

  return (
    <Box
      padding="10px"
      display="flex"
      gap={isMobile ? '10px' : '14px'}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        ':hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      }}
      width={'100%'}
      boxSizing={'border-box'}
      position={'relative'}
      onClick={handleNavigation}
    >
      <Box
        component="img"
        width={isMobile ? '80px' : '140px'}
        height={isMobile ? '80px' : '140px'}
        src={event.image_url}
        borderRadius="10px"
      />
      <Box display="flex" flexDirection="column" gap="10px" flexGrow={1}>
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
          gap="10px"
        >
          <Box display="flex" alignItems="center" gap="6px">
            <Typography color="white" variant="caption">
              BY:
            </Typography>
            {/* <Box
              component="img"
              width="18px"
              height="18px"
              src={event.space?.avatar}
              borderRadius="40px"
            /> */}
            <Image
              src={
                event.space?.avatar ||
                'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
              }
              loader={() =>
                event.space?.avatar ||
                'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
              }
              width={18}
              height={18}
              alt={event.title}
              style={{ borderRadius: '100%' }}
            />
            <Typography
              color="white"
              variant="bodyS"
              fontWeight={300}
              letterSpacing={'0.01em'}
            >
              {event.space?.name}
            </Typography>
          </Box>
          <Typography
            color="rgba(225, 225, 225, 0.6)"
            variant="bodyS"
            fontWeight={300}
            fontSize={'14px'}
          >
            {formatTimestamp(event.startTime)} -{' '}
            {formatTimestamp(event.endTime)}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography
            color="white"
            variant={isMobile ? 'subtitleSB' : 'subtitleLB'}
          >
            {event.title}
          </Typography>
          <Typography color="rgba(255,255,255,0.6)" variant="bodyM">
            {event.tagline}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="6px" sx={{ opacity: 0.5 }}>
          <MapIcon size={4} />
          <Typography
            variant={'caption'}
            sx={{
              color: 'white',
              textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
              fontSize: '10px',
              letterSpacing: '0.2px',
              textTransform: 'uppercase',
            }}
          >
            {eventLocation}
          </Typography>
        </Box>
      </Box>
      {/* <Box>
        <Box
          padding={isMobile ? '4px 4px' : '4px 10px'}
          flex="display"
          gap="4px"
          display="flex"
          alignItems="center"
          borderRadius="10px"
          bgcolor="#292929"
        >
          <LockIcon size={4} color={'rgba(255, 255, 255, 0.8)'} />
          {!isMobile && (
            <Typography
              marginTop={'2px'}
              color="rgba(255, 255, 255, 0.8)"
              variant="bodyS"
              fontWeight={300}
            >
              Gated
            </Typography>
          )}
        </Box>
      </Box> */}
    </Box>
  );
};

export const EventCardMonthGroup: React.FC<
  React.PropsWithChildren<{
    bgColor?: 'transparent' | string;
  }>
> = ({ children, bgColor = 'rgba(34, 34, 34, 0.80)' }) => {
  return (
    <Box
      component={'div'}
      width={'100%'}
      color="#ccc"
      justifyContent="center"
      alignContent={'center'}
      paddingY="8px"
      fontWeight={700}
      display={'flex'}
      sx={{
        borderRadius: '40px',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backgroundColor: bgColor,
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </Box>
  );
};

export const EventCardSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      padding="10px"
      display="flex"
      gap={isMobile ? '10px' : '14px'}
      sx={{ cursor: 'pointer' }}
      width={'100%'}
      boxSizing={'border-box'}
      position={'relative'}
    >
      <Skeleton
        variant="rectangular"
        width={isMobile ? '80px' : '140px'}
        height={isMobile ? '80px' : '140px'}
        sx={{ borderRadius: '10px' }}
      />
      <Box display="flex" flexDirection="column" gap="10px" flexGrow={1}>
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
          gap="10px"
        >
          <Typography color="white" variant="caption">
            BY:
          </Typography>
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" width={100} />
        </Box>
        <Box display="flex" flexDirection="column">
          <Skeleton variant="text" width={isMobile ? '100%' : '80%'} />
          <Skeleton variant="text" width={isMobile ? '60%' : '70%'} />
        </Box>
        <Box display="flex" alignItems="center" gap="6px" sx={{ opacity: 0.5 }}>
          <MapIcon size={4} />
          <Skeleton variant="text" width={100} />
        </Box>
      </Box>
    </Box>
  );
};

export { EventCard };

export default EventCard;
