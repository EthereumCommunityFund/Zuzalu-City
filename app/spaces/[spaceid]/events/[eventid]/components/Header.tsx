'use client';
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { LeftArrowIcon, ShareIcon, ThreeHorizonIcon } from 'components/icons';
import { ZuButton } from 'components/core';

const Header = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      padding="10px 14px"
      borderBottom="1px solid #383838"
      bgcolor="#2d2d2d"
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <ZuButton startIcon={<LeftArrowIcon />}>Back</ZuButton>
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
          <ThreeHorizonIcon />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Header;
