'use client';
import * as React from 'react';
import Link from 'next/link';
import { Typography, Button, Box, Stack, Skeleton } from '@mui/material';
import { CheckCircleIcon, PlusCircleIcon, UsersIcon } from '../icons';
import TextEditor from '../editor/editor';
import { SPACE_CATEGORIES } from '@/constant';

export type SpaceCardProps = {
  id?: string;
  bgImage?: string;
  logoImage?: string;
  title?: string;
  description?: string;
  joined?: boolean;
  members?: {
    id: string;
  }[];
  categories?: string;
};

const SpaceCard: React.FC<SpaceCardProps> = ({
  id,
  bgImage = '/5.webp',
  logoImage = '/1.webp',
  title,
  description,
  joined = false,
  members = [],
  categories = '',
}) => {
  return (
    <Link href={`/spaces/${id}`} style={{ textDecoration: 'none' }}>
      <Stack
        width={290}
        borderRadius="10px"
        bgcolor="#292929"
        sx={{
          ':hover': {
            bgcolor: '#2d2d2d',
          },
        }}
        border="1px solid rgba(255, 255, 255, 0.1)"
        position="relative"
        minHeight={252}
        maxHeight={288}
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
          component="img"
          src={logoImage}
          height={60}
          width={60}
          position="absolute"
          top={68}
          left={12}
          borderRadius={30}
        />
        <Stack padding="10px" spacing="10px" marginTop="20px">
          <Typography color="white" gutterBottom variant="subtitleS">
            {title}
          </Typography>
          <Stack sx={{ maxHeight: '44px', overflow: 'auto' }}>
            <Typography
              variant="bodyM"
              color="white"
              sx={{ wordWrap: 'break-word', opacity: 0.6, lineHeight: '22px' }}
            >
              {description &&
                JSON.parse(description.replaceAll('\\"', '"')).blocks[0].data
                  .text}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography color="white" variant="caption" sx={{ opacity: 0.5 }}>
              {categories &&
                categories
                  .split(', ')
                  .map(
                    (category) =>
                      SPACE_CATEGORIES.filter(
                        (cat) => cat.value === category,
                      )[0].label,
                  )
                  .join(', ')}
            </Typography>
          </Stack>

          {members && members.length > 0 && (
            <Stack direction="row" alignItems="center" spacing="10px">
              <UsersIcon size={4} />
              <Typography
                color="white"
                variant="bodyS"
                sx={{ textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)' }}
              >
                {members.length >= 1000
                  ? (members.length / 1000).toFixed(1) + 'k'
                  : members.length}
              </Typography>
            </Stack>
          )}
          {/* <Button
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
            </Button> */}
        </Stack>
      </Stack>
    </Link>
  );
};

export const SpaceCardSkeleton: React.FC = () => {
  return (
    <Stack
      width={290}
      borderRadius="10px"
      bgcolor="#292929"
      sx={{
        ':hover': {
          bgcolor: '#2d2d2d',
        },
      }}
      border="1px solid rgba(255, 255, 255, 0.1)"
      position="relative"
      minHeight={252}
    >
      <Skeleton
        variant="rectangular"
        height={106}
        sx={{
          borderRadius: '10px 10px 0 0',
        }}
      />
      <Box
        width={60}
        height={60}
        sx={{
          backgroundColor: '#2b2b2b',
          position: 'absolute',
          top: 68,
          left: 12,
          padding: '5px',
          borderRadius: 30,
        }}
      >
        <Skeleton variant="circular" width={50} height={50} />
      </Box>
      <Stack padding="10px" spacing="10px" marginTop="20px">
        <Typography color="white" gutterBottom variant="subtitleS">
          <Skeleton width={'40%'}></Skeleton>
        </Typography>
        <Typography variant="bodyM" color="white" sx={{ opacity: 0.6 }}>
          <Skeleton width={'90%'}></Skeleton>
        </Typography>
        <Typography color="white" variant="caption" sx={{ opacity: 0.5 }}>
          <Skeleton width={'60%'}></Skeleton>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default SpaceCard;
