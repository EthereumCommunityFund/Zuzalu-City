'use client';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import {
  EventIcon,
  SpaceIcon,
  BoltIcon,
  HomeIcon,
  SpacePlusIcon,
} from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';

interface SidebarProps {
  selected: string;
}

const Sidebar: React.FC<SidebarProps> = ({ selected }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useCeramicContext();

  const naviButtons = [
    {
      content: 'Home',
      icon: <HomeIcon />,
      function: () => router.push('/'),
    },
    {
      content: 'Spaces',
      icon: <SpaceIcon />,
      function: () => router.push('/spaces'),
    },
    {
      content: 'Events',
      icon: <EventIcon />,
      function: () => router.push('/events'),
    },
    // {
    //   content: 'Zapps',
    //   icon: <BoltIcon />,
    //   function: () => { }
    // }
  ];

  const spaces = [
    {
      src: '/0.webp',
      content: 'Zuzalu City Contributors',
      function: () => router.push('/spaces/123'),
    },
    {
      src: '/0.webp',
      content: 'FendiWeb3',
      function: () => router.push('/spaces/123'),
    },
    {
      src: '/0.webp',
      content: 'Green Odin',
      function: () => router.push('/spaces/123'),
    },
  ];

  return (
    <Box
      sx={{
        width: selected !== 'Space Details' ? '260px' : 'auto',
        height: 'calc(100vh - 50px)',
        position: 'sticky',
        top: '50px',
        transitionProperty: 'width',
        transitionDuration: '300',
        transitionTimingFunction: 'ease-in-out',
        backgroundColor: '#2d2d2d',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        paddingX="10px"
        paddingY="20px"
        gap="15px"
      >
        {naviButtons.map((item, index) => {
          return (
            <Box
              display="flex"
              padding="10px"
              alignItems="center"
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#383838' } }}
              bgcolor={
                pathname.split('/')[1] === item.content.toLowerCase()
                  ? '#383838'
                  : 'transparent'
              }
              gap="10px"
              borderRadius="10px"
              onClick={item.function}
              key={index}
            >
              {item.icon}
              {selected !== 'Space Details' && (
                <Typography color="white" variant="bodyMB">
                  {item.content}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
      {isAuthenticated && (
        <Box
          display="flex"
          flexDirection="column"
          gap="15px"
          sx={{
            borderTop: '1px solid #383838',
            marginX: '10px',
            paddingTop: selected !== 'Space Details' ? '0px' : '20px',
          }}
        >
          {/*{*/}
          {/*  selected !== "Space Details" && <Typography*/}
          {/*    color="white"*/}
          {/*    variant="bodyS"*/}
          {/*    marginTop="15px"*/}
          {/*    marginBottom="10px"*/}
          {/*    marginLeft="10px"*/}
          {/*  >*/}
          {/*    YOUR SPACES*/}
          {/*  </Typography>*/}
          {/*}*/}
          {/*{*/}
          {/*  spaces.map((space, index) => {*/}
          {/*    return (*/}
          {/*      <Box*/}
          {/*        display="flex"*/}
          {/*        alignItems="center"*/}
          {/*        gap="10px"*/}
          {/*        onClick={space.function}*/}
          {/*        sx={{ cursor: 'pointer' }}*/}
          {/*        key={index}*/}
          {/*      >*/}
          {/*        <Box component="img" src={space.src} height="40px" width="40px" borderRadius="20px" />*/}
          {/*        {*/}
          {/*          selected !== "Space Details" && <Typography color="white" variant="bodyMB">*/}
          {/*            {*/}
          {/*              space.content*/}
          {/*            }*/}
          {/*          </Typography>*/}
          {/*        }*/}
          {/*      </Box>*/}
          {/*    )*/}
          {/*  })*/}
          {/*}*/}
          <br />
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            gap="10px"
            paddingLeft="5px"
            onClick={() => router.push('/spaces/create')}
          >
            <SpacePlusIcon />
            {selected !== 'Space Details' && (
              <Typography color="white" variant="bodyMB">
                Create a Space
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
