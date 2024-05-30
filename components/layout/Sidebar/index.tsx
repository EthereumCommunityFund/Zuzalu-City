'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import {
  EventIcon,
  StreamIcon,
  SpaceIcon,
  BoltIcon,
  HomeIcon,
  SpacePlusIcon,
} from 'components/icons';

interface SidebarProps {
  selected: string;
}

const Sidebar: React.FC<SidebarProps> = ({ selected }) => {
  const router = useRouter();

  return (
    <Box sx={{ width: '260px', height: '100vh', position: 'sticky', top: '0px' }}>
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
          bgcolor={selected === 'Home' ? '#383838' : 'transparent'}
          gap="10px"
          borderRadius="10px"
          onClick={() => {
            router.push('/');
          }}
        >
          <HomeIcon />
          <Typography color="white" variant="bodyMB">
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
          <Typography color="white" variant="bodyMB">
            Stream
          </Typography>
        </Box>
        <Box
          display="flex"
          padding="10px"
          alignItems="center"
          bgcolor={selected === 'Spaces' ? '#383838' : 'transparent'}
          sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#383838' } }}
          gap="10px"
          borderRadius="10px"
          onClick={() => {
            router.push('/spaces');
          }}
        >
          <SpaceIcon />
          <Typography color="white" variant="bodyMB">
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
          <Typography color="white" variant="bodyMB">
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
          <Typography color="white" variant="bodyMB">
            Zapps
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="15px"
        sx={{ borderTop: '1px solid #383838', marginX: '10px' }}
      >
        <Typography
          color="white"
          variant="bodyS"
          marginTop="15px"
          marginBottom="10px"
          marginLeft="10px"
        >
          YOUR SPACES
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          onClick={() => router.push('/spaces/123')}
          sx={{ cursor: 'pointer' }}
        >
          <Box component="img" src="/0.webp" height="40px" />
          <Typography color="white" variant="bodyMB">
            Zuzalu City Contributors
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          onClick={() => router.push('/spaces/123')}
          sx={{ cursor: 'pointer' }}
        >
          <Box
            component="img"
            src="/0.webp"
            height="40px"
            width="40px"
            borderRadius="20px"
          />
          <Typography color="white" variant="bodyMB">
            FendiWeb3
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          onClick={() => router.push('/spaces/123')}
          sx={{ cursor: 'pointer' }}
        >
          <Box
            component="img"
            src="/0.webp"
            height="40px"
            borderRadius="20px"
            width="40px"
          />
          <Typography color="white" variant="bodyMB">
            Green Odin
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="10px" paddingLeft="5px">
          <SpacePlusIcon />
          <Typography color="white" variant="bodyMB">
            Create a Space
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
