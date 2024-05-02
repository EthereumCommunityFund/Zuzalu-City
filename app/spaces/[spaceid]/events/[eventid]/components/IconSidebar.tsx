'use client';
import * as React from 'react';
import { Box, Stack } from '@mui/material';
import { ZuButton } from 'components/core';
import { BoltIcon, CalendarIcon, HomeIcon, SpaceIcon, SpacePlusIcon, StreamIcon } from 'components/icons';

const IconSidebar = () => {
  return (
    <Stack bgcolor='#2D2D2D' direction='column' spacing={3} width='65px' height='auto' paddingTop={3}>
      <Stack direction='column' spacing={3} alignItems='center'>
        <Stack>
          <HomeIcon />
        </Stack>
        <Stack>
          <StreamIcon />
        </Stack>
        <Stack>
          <SpaceIcon />
        </Stack>
        <Stack>
          <CalendarIcon />
        </Stack>
        <Stack>
          <BoltIcon />
        </Stack>
      </Stack>
      <Stack direction='column' spacing={3} alignItems='center'>
        <Box component="img" src="/1.webp" height="40px" width='40px' borderRadius='20px' />
        <Box component="img" src="/3.webp" height="40px" width='40px' borderRadius='20px' />
        <Box component="img" src="/2.webp" height="40px" width='40px' borderRadius='20px' />
        <Stack>
          <SpacePlusIcon />
        </Stack>
      </Stack>
    </Stack>
  )
}

export default IconSidebar;