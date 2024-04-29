'use client';
import * as React from 'react';
import { Stack, Typography, useTheme } from '@mui/material';
import { ZuButton } from 'components/core';
import { SpacePlusIcon } from 'components/icons';

const SpaceHeader = () => {
  const theme = useTheme();

  return (
    <Stack
      padding="40px 25px"
      direction="column"
      spacing={2}
      borderBottom="1px solid #383838"
    >
      <Typography color={theme.palette.text.primary} variant="h1">
        Spaces
      </Typography>
      <Typography color={theme.palette.text.primary} variant="bodyBB">
        Welcome to the new Zuzalu City
      </Typography>
      <ZuButton startIcon={<SpacePlusIcon />}>Create a Space</ZuButton>
    </Stack>
  );
};

export default SpaceHeader;
