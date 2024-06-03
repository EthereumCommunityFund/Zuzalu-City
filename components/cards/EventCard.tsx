'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { MapIcon, LockIcon } from '../icons';

type EventCardProps = {
  by?: string;
  name?: string;
  description?: string;
  location?: string;
  logo?: string;
};

const EventCard: React.FC<EventCardProps> = ({
  by = 'Zuzalu Contributor',
  name = 'HackZuzalu ChiangMai',
  description = 'A Popup Village of Innovation in the Heart of Istanbul',
  location = 'ISTANBUL, TURKEY',
  logo = '/4.webp',
}) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      padding="10px"
      display="flex"
      gap={isMobile ? '10px' : '14px'}
      sx={{ cursor: 'pointer' }}
      onClick={() => router.push('/spaces/123/events/456')}
    >
      <Box
        component="img"
        width={isMobile ? '80px' : '140px'}
        height={isMobile ? '80px' : '140px'}
        src={logo}
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
            <Typography color="white" variant="caption">
              BY:
            </Typography>
            <Box
              component="img"
              width="18px"
              height="18px"
              src="/0.webp"
              borderRadius="40px"
            />
            <Typography
              color="white"
              variant="bodyS"
              fontWeight={300}
              fontSize={'13px'}
              letterSpacing={'0.01em'}
            >
              {by}
            </Typography>
          </Box>
          <Typography
            color="rgba(225, 225, 225, 0.6)"
            variant="bodyS"
            fontWeight={300}
            fontSize={'16px'}
          >
            October 8 - October 20
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography
            color="white"
            variant={isMobile ? 'subtitleSB' : 'subtitleLB'}
          >
            {name}
          </Typography>
          <Typography color="white" variant="bodyM">
            {description}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap="6px"
          sx={{ opacity: '0.7' }}
        >
          <MapIcon size={4} />
          <Typography color="white" variant="caption">
            {location}
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
            <Typography color="white" variant="bodyS" fontWeight={300}>
              Gated
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EventCard;
