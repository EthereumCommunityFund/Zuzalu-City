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
            <Box
              component="span"
              color="white"
              fontSize="10px"
              fontWeight={400}
            >
              BY:
            </Box>
            <Box
              component="img"
              width="18px"
              height="18px"
              src="0.webp"
              borderRadius="40px"
            />
            <Box
              component="span"
              color="white"
              fontSize="13px"
              fontWeight={500}
              fontFamily="Inter"
            >
              Zuzalu Contributor
            </Box>
          </Box>
          <Box>
            <Box
              component="span"
              color="white"
              fontSize="14px"
              fontWeight={500}
              fontFamily="Inter"
            >
              October 8 - October 20
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography
            color="white"
            fontSize={isMobile ? '18px' : '25px'}
            fontWeight={700}
            fontFamily="Inter"
          >
            HackZuzalu ChiangMai
          </Typography>
          <Typography
            color="white"
            fontSize="13px"
            fontWeight={400}
            fontFamily="Inter"
          >
            A Popup Village of Innovation in the Heart of Istanbul{' '}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="6px">
          <MapIcon />
          <Typography
            color="white"
            fontSize="10px"
            fontWeight={400}
            fontFamily="Inter"
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
              fontSize="13px"
              fontWeight={600}
              fontFamily="Inter"
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
