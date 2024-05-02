import * as React from 'react';
import { Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import { EventIcon, MapIcon } from 'components/icons';

const EventName = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Stack spacing='10px'>
      <Box component='img' width={isTablet ? '350px' : '500px'} height={isTablet ? '350px' : '500px'} src='/14.webp' />
      <Stack direction='row' padding='4px 10px' borderRadius='10px' border='1px solid #383838' width='fit-content' alignItems='center'>
        <Typography color='white' variant='caption'>FEATURED IN:&nbsp;</Typography>
        <Typography color='white' variant='bodySB'>HackZuzalu Side-events</Typography>
      </Stack>
      <Typography color='white' variant='subtitleLB'>Event Name</Typography>
      <Typography color='white' variant='bodyM'>Event Description</Typography>
      <Stack direction='row' spacing='5px' alignItems='center'>
        <Typography color='white' variant='caption'>BY: </Typography>
        <Box component='img' width={20} height={20} src='/0.webp' />
        <Typography color='white' variant='bodyS'>Space Name</Typography>
      </Stack>
      <Stack direction='row' spacing={1} alignItems='center'>
        <Stack direction='row' padding={1} borderRadius='10px' alignItems='center' bgcolor='#292929'>
          <EventIcon />
        </Stack>
        <Typography color='white' variant='bodyMB'>Month, Day - Month, Day</Typography>
      </Stack>
      <Stack direction='row' spacing={1} alignItems='center'>
        <Stack direction='row' padding={1} borderRadius='10px' alignItems='center' bgcolor='#292929'>
          <MapIcon />
        </Stack>
        <Typography color='white' variant='bodyMB'>Location</Typography>
      </Stack>
    </Stack>
  )
}

export default EventName;