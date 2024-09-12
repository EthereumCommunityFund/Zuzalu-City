'use client';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, styled, Typography } from '@mui/material';
import { EventIcon, SpaceIcon, HomeIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { ZuButton } from '@/components/core';
interface SidebarProps {
  selected: string;
}

const Sidebar: React.FC<SidebarProps> = ({ selected }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { ceramic, isAuthenticated } = useCeramicContext();
  const naviButtons = [
    {
      content: 'Home',
      icon: <HomeIcon />,
      function: () => router.push('/'),
      url: '/',
    },
    {
      content: 'Spaces',
      icon: <SpaceIcon />,
      function: () => router.push('/spaces'),
      url: '/spaces',
    },
    {
      content: 'Events',
      icon: <EventIcon />,
      function: () => router.push('/events'),
      url: '/events',
    },
    // {
    //   content: 'Zapps',
    //   icon: <BoltIcon />,
    //   function: () => { }
    // }
  ];

  const footerItems = [
    {
      content: 'Blog',
      url: 'https://zuzalu.craft.me/ZuBuilderBlog',
    },
    // {
    //   content: 'Privacy',
    //   url: 'https://blog.zuzalu.city',
    // },
    // {
    //   content: 'Terms',
    //   url: 'https://blog.zuzalu.city',
    // },
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
        display: 'flex',
        flexDirection: 'column',
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
              bgcolor={pathname === item.url ? '#383838' : 'transparent'}
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
      <Box
        display="flex"
        flexDirection="column"
        gap="15px"
        sx={{
          borderTop: '1px solid #383838',
          borderBottom: '1px solid #383838',
          marginX: '10px',
          paddingTop: selected !== 'Space Details' ? '0px' : '20px',
          flex: 1,
        }}
      >
        <br />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          marginX: '10px',
          padding: '20px 0',
        }}
      >
        <Box
          gap="10px"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '10px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
            }}
          >
            {footerItems.map((item, index) => {
              return (
                <Typography
                  key={index}
                  color="rgba(225, 225, 225, 0.7)"
                  variant="body2"
                  component="a"
                  href={item.url}
                  target="_blank"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      textDecorationColor: '#7dffd1',
                      color: '#7dffd1',
                      opacity: 0.7,
                    },
                  }}
                >
                  {item.content}
                </Typography>
              );
            })}
          </Box>
          <Typography
            color="rgba(225, 225, 225, 0.7)"
            variant="body2"
            component="a"
            href="https://s.craft.me/XUjXr6M4jT8VBZ"
            target="_blank"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                textDecorationColor: '#7dffd1',
                color: '#7dffd1',
                opacity: 0.7,
              },
            }}
          >
            About Zuzalu City
          </Typography>
        </Box>
        <ZuButton
          variant="outlined"
          sx={{
            width: '100%',
            height: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '14px',
            color: '#fff',
            fontWeight: 700,
            marginTop: '30px',
          }}
          onClick={() => window.open('https://zuzalu.city', '_blank')}
        >
          Legacy Registry App
        </ZuButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
