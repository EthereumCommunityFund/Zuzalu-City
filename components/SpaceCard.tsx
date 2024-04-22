import * as React from 'react';
import {
  Card,
  CardMedia,
  Typography,
  Button,
  CardContent,
  CardActions,
  Box,
} from '@mui/material';
import { CheckCircleIcon, PlusCircleIcon, UsersIcon } from './icons';

export type SpaceCardProps = {
  bgImage: string;
  logoImage: string;
  title: string,
  description: string,
  joined: boolean
};

const SpaceCard: React.FC<SpaceCardProps> = ({ bgImage, logoImage, title, description, joined }) => {
  return (
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
          fontSize="18px"
          fontWeight={600}
          color="white"
          component="div"
          marginTop="30px"
          fontFamily="Inter"
        >
          {title}
        </Typography>
        <Typography
          fontSize="14px"
          fontWeight={500}
          color="white"
          fontFamily="Inter"
        >
          {description}
        </Typography>
        <Box display="flex" marginY="10px" sx={{ opacity: 0.5 }}>
          <Typography
            color="white"
            fontSize="10px"
            fontWeight={400}
            fontFamily="Inter"
          >
            AI
          </Typography>
          <Typography
            color="white"
            fontSize="10px"
            fontWeight={400}
            marginX="10px"
            fontFamily="Inter"
          >
            COMMUNITY TOOLS
          </Typography>
          <Typography
            color="white"
            fontSize="10px"
            fontWeight={400}
            fontFamily="Inter"
          >
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
            fontSize="13px"
            fontWeight={500}
            sx={{ textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)' }}
            fontFamily="Inter"
          >
            1.4k
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={joined ? <CheckCircleIcon color='#D7FFC4' /> : <PlusCircleIcon />}
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
  );
};

export default SpaceCard;
