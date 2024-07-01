'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Typography, useTheme } from '@mui/material';
import { ZuButton } from 'components/core';
import { ShareIcon, HomeIcon } from 'components/icons';
import { MoreIcon } from '@/components/icons/More';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface IThumbnail {
  name?: string;
}

const Thumbnail: React.FC<IThumbnail> = ({ name }) => {
  const router = useRouter();
  const { breakpoints } = useTheme();

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
          sx={{
            backgroundColor: '#333333',
            minWidth: 'unset',
          }}
          onClick={() => router.push('/')}
        >
          <ArrowBackIcon />
          <Typography
            sx={{
              [breakpoints.down('md')]: {
                display: 'none',
              },
            }}
          >
            Back
          </Typography>
        </ZuButton>
        <Typography variant="h6" color="white" lineHeight="40px">
          {name}
        </Typography>
      </Stack>
      <Stack direction="row" gap={1}>
        <Stack
          direction="row"
          padding={1}
          alignItems="center"
          bgcolor="#333333"
          borderRadius={2}
          sx={{
            [breakpoints.down('md')]: {
              display: 'none',
            },
          }}
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
          <MoreIcon />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Thumbnail;
