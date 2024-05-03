'use client';
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { LeftArrowIcon, ShareIcon, HomeIcon } from 'components/icons';

const Thumbnail = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      padding="5px 14px"
      borderBottom="1px solid #383838"
      bgcolor="#2d2d2d"
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <ZuButton
          sx={{backgroundColor: '#333333'}} 
          startIcon={<LeftArrowIcon />}>
          Back
        </ZuButton>
        <Typography variant="h6" color="white" lineHeight="40px">
          HackZuzalu
        </Typography>
      </Stack>
      <Stack direction="row" gap={1}>
        <Stack
          direction="row"
          padding={1}
          alignItems="center"
          bgcolor="#333333"
          borderRadius={2}
        >
          <ShareIcon />
        </Stack>
        <Stack
          direction="row"
          padding={1}
          alignItems="center"
          bgcolor="#333333"
          borderRadius={2}
        >
          <HomeIcon />
        </Stack>
      </Stack>
  </Stack>
  )
}

export default Thumbnail;