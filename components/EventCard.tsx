'use client';
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { MapIcon, LockIcon } from './icons';

const EventCard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box padding="10px" display="flex" gap={isMobile ? '10px' : '14px'}>
      <Box
        component="img"
        width={isMobile ? '80px' : '150px'}
        height={isMobile ? '80px' : '150px'}
        src="4.webp"
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
            <Typography
              color="white"
              variant='caption'
            >
              BY:
            </Typography>
            <Box
              component="img"
              width="18px"
              height="18px"
              src="0.webp"
              borderRadius="40px"
            />
            <Typography
              color="white"
              variant='bodyS'
            >
              Zuzalu Contributor
            </Typography>
          </Box>
          <Typography
            color="white"
            variant='bodyS'
          >
            October 8 - October 20
          </Typography>
        </Box>
        <Box display='flex' flexDirection='column'>
          <Typography
            color="white"
            variant={isMobile ? 'subtitleSB' : 'subtitleLB'}
          >
            HackZuzalu ChiangMai
          </Typography>
          <Typography
            color="white"
            variant='bodyM'
          >
            A Popup Village of Innovation in the Heart of Istanbul{' '}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="6px">
          <MapIcon />
          <Typography
            color="white"
            variant='caption'
          >
            ISTANBUL, TURKEY
          </Typography>
        </Box>
      </Box>
      <Box>
        <Box
          padding={isMobile ? '4px 4px' : '4px 10px'}
          flex="display"
          gap="4px"
          display="flex"
          alignItems="center"
          borderRadius="10px"
          bgcolor="#292929"
        >
          <LockIcon />
          {!isMobile && (
            <Typography
              color="white"
              variant='bodyS'
            >
              Gated
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EventCard;
