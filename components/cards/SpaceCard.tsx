'use client';
import * as React from 'react';
import Link from 'next/link';
import { Typography, Button, Box, Stack } from '@mui/material';
import { CheckCircleIcon, PlusCircleIcon, UsersIcon } from '../icons';

export type SpaceCardProps = {
  bgImage?: string;
  logoImage?: string;
  title: string;
  description?: string;
  joined?: boolean;
};

const SpaceCard: React.FC<SpaceCardProps> = ({
  bgImage = '/5.webp',
  logoImage = '/1.webp',
  title,
  description = 'Welcome Zucity',
  joined = false,
}) => {
  return (
    <Link
      href={`/spaces/${title.split(' ')[0]}`}
      style={{ textDecoration: 'none' }}
    >
      <Stack
        width={290}
        borderRadius='10px'
        bgcolor='#292929'
        sx={{
          ':hover': {
            bgcolor: '#2d2d2d',
          },
        }}
        border='1px solid rgba(255, 255, 255, 0.1)'
        position='relative'
      >
        <Box
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
          height={106}
          borderRadius={'10px 10px 0 0'}
        />
        <Box
          component='img'
          src={logoImage}
          height={60}
          width={60}
          position='absolute'
          top={70}
          left={13}
          borderRadius={30}
        />
        <Stack padding='10px' spacing='10px' marginTop='20px'>
          <Typography color='white' gutterBottom variant="subtitleS">
            {title}
          </Typography>
          <Typography variant="bodyM" color="white">
            {description}
          </Typography>
          <Stack direction='row'>
            <Typography color="white" variant="caption">
              AI
            </Typography>
            <Typography color="white" variant="caption" marginX="10px">
              COMMUNITY TOOLS
            </Typography>
            <Typography color="white" variant="caption">
              +3
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' spacing='10px'>
            <UsersIcon size={4} />
            <Typography
              color="white"
              variant="bodyS"
              sx={{ textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)' }}
            >
              1.4k
            </Typography>
            <Button
              size="small"
              startIcon={
                joined ? (
                  <CheckCircleIcon size={5} color="#D7FFC4" />
                ) : (
                  <PlusCircleIcon size={5} />
                )
              }
              sx={{
                backgroundColor: joined ? '#606C5A' : '#383838',
                color: joined ? '#D7FFC4' : 'white',
                flexGrow: 1,
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter',
              }}
            >
              {joined ? 'Joined' : 'Join'}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Link>
  );
};

export default SpaceCard;
