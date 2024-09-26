import * as React from 'react';
import { Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import { EventIcon, GroupIcon, MapIcon } from 'components/icons';
import { convertDateStringFormat } from '@/utils';

interface PropTypes {
  spaceName?: string;
  eventName: string;
  eventDescription: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl?: string;
  organizer: string;
  tagline?: string;
  avatar?: string;
  status?: string;
}

const EventName = ({
  spaceName,
  eventName,
  eventDescription,
  endTime,
  startTime,
  location,
  imageUrl,
  organizer,
  tagline,
  avatar,
  status,
}: PropTypes) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  function isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <Stack spacing="10px">
      <Stack width={'100%'} alignItems={'center'} justifyContent={'center'}>
        <Stack width={'100%'} alignItems={'center'} justifyContent={'center'}>
          <Box
            component="img"
            width={isMobile ? '350px' : '500px'}
            height={isMobile ? '350px' : '500px'}
            src={imageUrl}
            borderRadius="10px"
            border="1px solid rgba(255, 255, 255, 0.2)"
          />
        </Stack>
      </Stack>
      <Stack
        sx={{
          padding: '0px 10px 20px 10px',
          [theme.breakpoints.down('sm')]: {
            padding: '0px 20px',
          },
        }}
        gap={'10px'}
      >
        <Stack padding={'10px'} gap={'20px'}>
          <Stack
            direction={'row'}
            gap={'10px'}
            alignItems={'center'}
            sx={{ paddingTop: '20px' }}
          >
            <Stack direction="row" spacing="5px" alignItems="center">
              <Typography color="rgba(255, 255, 255, 0.80)" variant="caption">
                BY:
              </Typography>
              <Box
                component="img"
                width={20}
                height={20}
                src={avatar}
                borderRadius="10px"
              />
              <Typography color="white" variant="bodyS">
                {spaceName}
              </Typography>
            </Stack>
            <Typography>/</Typography>
            <Stack direction="row" spacing="5px" alignItems="center">
              <GroupIcon size={7} />
              <Typography
                color="rgba(255, 255, 255, 0.80)"
                variant="bodyS"
                textTransform={'uppercase'}
              >
                {`${status} event`}
              </Typography>
            </Stack>
          </Stack>
          <Stack>
            <Typography color="white" variant="subtitleLB">
              {eventName}
            </Typography>
            <Typography
              color="white"
              variant="bodyM"
              sx={{ opacity: 0.6 }}
              fontSize={'14px'}
            >
              {tagline}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ opacity: '0.6' }}
        >
          <Stack
            direction="row"
            padding={1}
            borderRadius="10px"
            alignItems="center"
            bgcolor="#292929"
          >
            <EventIcon />
          </Stack>
          <Typography color="white" variant="bodyMB">
            {convertDateStringFormat(startTime)} -{' '}
            {convertDateStringFormat(endTime)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ opacity: '0.6' }}
        >
          <Stack
            direction="row"
            padding={1}
            borderRadius="10px"
            alignItems="center"
            bgcolor="#292929"
          >
            <MapIcon />
          </Stack>
          <Typography color="white" variant="bodyMB">
            {location ? location : 'N/A'}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default EventName;
