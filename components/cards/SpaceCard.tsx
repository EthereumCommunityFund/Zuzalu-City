'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardMedia,
  Typography,
  Button,
  CardContent,
  CardActions,
  Box,
  ButtonBase,
} from '@mui/material';
import { CheckCircleIcon, PlusCircleIcon, UsersIcon } from '../icons';

export type SpaceCardProps = {
  bgImage: string;
  logoImage: string;
  title: string;
  description: string;
  joined: boolean;
};

const SpaceCard: React.FC<SpaceCardProps> = ({
  bgImage,
  logoImage,
  title,
  description,
  joined,
}) => {
  const router = useRouter();

  return (
    <Link
      href={`/spaces/${title.split(' ')[0]}`}
      style={{ textDecoration: 'none' }}
    >
      <Card
        sx={{
          borderRadius: '10px',
          scrollSnapAlign: 'start',
          flexShrink: 0,
          width: '290px',
        }}
      >
        <CardMedia sx={{ height: 106 }} image={bgImage} title="green iguana" />
        <CardContent
          sx={{
            backgroundColor: '#2d2d2d',
            paddingY: '5px',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={logoImage}
            width="60px"
            height="60px"
            borderRadius="30px"
            position="absolute"
            top="-30px"
          ></Box>
          <Typography
            gutterBottom
            variant="subtitleS"
            component="div"
            color="white"
            marginTop="30px"
          >
            {title}
          </Typography>
          <Typography variant="bodyM" color="white">
            {description}
          </Typography>
          <Box display="flex" marginY="10px" sx={{ opacity: 0.5 }}>
            <Typography color="white" variant="caption">
              AI
            </Typography>
            <Typography color="white" variant="caption" marginX="10px">
              COMMUNITY TOOLS
            </Typography>
            <Typography color="white" variant="caption">
              +3
            </Typography>
          </Box>
        </CardContent>
        <CardActions
          sx={{
            backgroundColor: '#2d2d2d',
            paddingX: '20px',
            paddingTop: '0px',
            gap: '10px',
          }}
        >
          <Box display="flex" alignItems="center">
            <UsersIcon />
            <Typography
              color="white"
              variant="bodyS"
              sx={{ textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)' }}
            >
              1.4k
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={
              joined ? <CheckCircleIcon color="#D7FFC4" /> : <PlusCircleIcon />
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
        </CardActions>
      </Card>
    </Link>
  );
};

export default SpaceCard;
