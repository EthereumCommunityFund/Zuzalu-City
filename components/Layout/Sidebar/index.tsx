'use client';
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import {
  EventIcon,
  StreamIcon,
  SpaceIcon,
  BoltIcon,
  HomeIcon,
  SpacePlusIcon,
} from '../../icons';

const Sidebar: React.FC = () => {
  return (
    <Box sx={{ width: '270px', height: '100vh' }}>
      <Box
        display="flex"
        flexDirection="column"
        paddingX="10px"
        paddingY="20px"
        gap="15px"
      >
        <Box
          display="flex"
          padding="10px"
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          bgcolor="#383838"
          gap="10px"
          borderRadius="10px"
        >
          <HomeIcon />
          <Typography color="white" fontWeight={700} fontSize="14px">
            Home
          </Typography>
        </Box>
        <Box
          display="flex"
          padding="10px"
          alignItems="center"
          sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#383838' } }}
          gap="10px"
          borderRadius="10px"
        >
          <StreamIcon />
          <Typography color="white" fontWeight={700} fontSize="14px">
            Stream
          </Typography>
        </Box>
        <Box
          display="flex"
          padding="10px"
          alignItems="center"
          sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#383838' } }}
          gap="10px"
          borderRadius="10px"
        >
          <SpaceIcon />
          <Typography color="white" fontWeight={700} fontSize="14px">
            Spaces
          </Typography>
        </Box>
        <Box
          display="flex"
          padding="10px"
          alignItems="center"
          sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#383838' } }}
          gap="10px"
          borderRadius="10px"
        >
          <EventIcon />
          <Typography color="white" fontWeight={700} fontSize="14px">
            Events
          </Typography>
        </Box>
        <Box
          display="flex"
          padding="10px"
          alignItems="center"
          sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#383838' } }}
          gap="10px"
          borderRadius="10px"
        >
          <BoltIcon />
          <Typography color="white" fontWeight={700} fontSize="14px">
            Zapps
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="15px"
        sx={{ borderTop: '1px solid grey', marginX: '10px' }}
      >
        <Typography
          color="white"
          fontSize="12px"
          marginTop="15px"
          marginBottom="10px"
          marginLeft="10px"
        >
          YOUR SPACES
        </Typography>
        <Box display="flex" alignItems="center" gap="10px">
          <Box component="img" src="0.webp" height="40px" />
          <Typography color="white" fontWeight={600} fontSize="14px">
            Zuzalu City Contributors
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="10px">
          <Box
            component="img"
            src="0.webp"
            height="40px"
            width="40px"
            borderRadius="20px"
          />
          <Typography color="white" fontWeight={600} fontSize="14px">
            FendiWeb3
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="10px">
          <Box
            component="img"
            src="0.webp"
            height="40px"
            borderRadius="20px"
            width="40px"
          />
          <Typography color="white" fontWeight={600} fontSize="14px">
            Green Odin
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="10px" paddingLeft="5px">
          <SpacePlusIcon />
          <Typography color="white" fontWeight={600} fontSize="14px">
            Create a Space
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
