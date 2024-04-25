import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ThreeHorizonIcon, ShareIcon } from 'components/icons';

const EventHeader = () => {
  return (
    <Stack direction='row' justifyContent='space-between' padding='10px 14px' borderBottom='1px solid #383838' bgcolor='#2d2d2d'>
      <Typography
        variant='h6'
        color="white"
        lineHeight='40px'
      >
        Manage Event
      </Typography>
      <Stack direction='row' gap={1}>
        <Stack
          direction='row'
          padding={1}
          alignItems="center"
          bgcolor="#333333"
          borderRadius={2}
        >
          <ShareIcon />
        </Stack>
        <Stack
          direction='row'
          padding={1}
          alignItems="center"
          bgcolor="#333333"
          borderRadius={2}
        >
          <ThreeHorizonIcon />
        </Stack>
      </Stack>
    </Stack>
  )
}

export default EventHeader;