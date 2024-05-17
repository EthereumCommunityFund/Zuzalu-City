'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Typography } from '@mui/material';
import { LeftArrowIcon } from 'components/icons';
import { ZuButton } from 'components/core';

const Header = () => {
  const router = useRouter();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      padding="10px 14px"
      borderBottom="1px solid #383838"
      bgcolor="#2d2d2d"
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <ZuButton
          startIcon={<LeftArrowIcon />}
          onClick={() => router.push('/spaces')}
        >
          Back
        </ZuButton>
        <Typography variant="bodyBB" color="white" lineHeight="40px">
          Create Space
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Header;
