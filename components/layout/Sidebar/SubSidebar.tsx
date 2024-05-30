'use client';
import React from 'react';
import { HomeIcon, SearchIcon, StreamIcon } from 'components/icons';
import SidebarButton from './SidebarButton';
import { ChatsIcon } from 'components/icons/Chats';
import { AnnouncementsIcon } from 'components/icons/Announcements';
import { ManageEventsIcon } from 'components/icons/ManageEvents';
import { ArrowDownIcon } from 'components/icons';
import { Stack, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

interface SubSidebarProps {
  spaceId: string;
}

const SubSidebar: React.FC<SubSidebarProps> = ({ spaceId }) => {
  const theme = useTheme();
  const router = useRouter();

  const buttonList = [
    {
      content: 'Search',
      icon: <SearchIcon />,
    },
    {
      content: 'Home',
      icon: <HomeIcon />,
    },
    {
      content: 'Space Stream',
      icon: <StreamIcon />,
    },
    {
      content: 'Announcements',
      icon: <AnnouncementsIcon />,
    },
    {
      content: 'Chats',
      icon: <ChatsIcon />,
    },
  ];

  return (
    <Stack
      sx={{
        minWidth: '280px',
        width: '280px',
        backgroundColor: '#222',
        borderRight: '1px solid #ffffff1a',
        display: 'none',
        [theme.breakpoints.up('lg')]: {
          display: 'block',
        },
        boxSizing: 'border-box',
        fontFamily: 'Inter',
      }}
    >
      <Stack
        sx={{
          width: '100%',
          padding: '10px',
          borderBottom: '1px solid #ffffff1a',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxSizing: 'border-box',
        }}
      >
        <Stack
          bgcolor="#404440"
          borderRadius="10px"
          border="1px solid #383838"
          padding="10px"
          direction="row"
          spacing="10px"
          alignItems="center"
          sx={{ cursor: 'pointer' }}
        >
          <Box
            component="img"
            width={40}
            height={40}
            borderRadius={20}
            src="/1.webp"
          />
          <Typography
            variant="subtitleS"
            color="white"
            sx={{ textWrap: 'wrap' }}
          >
            Zuzalu City Contributors
          </Typography>
          <ArrowDownIcon />
        </Stack>
        <SidebarButton
          content="Exit Space"
          sx={{
            backgroundColor: '#ffffff05',
            '&:hover': {
              backgroundColor: '#ffffff1a',
              opacity: '1',
            },
            padding: '8px 10px',
            borderRadius: '10px',
            cursor: 'pointer',
            opacity: '0.6',
          }}
        ></SidebarButton>
      </Stack>
      <Stack
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <Stack
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '20px 10px',
            boxSizing: 'border-box',
          }}
        >
          {buttonList.map((item, index) => {
            if (item.content === 'Search') {
              return (
                <SidebarButton
                  icon={item.icon}
                  content={item.content}
                  key={index}
                  isActive={false}
                  sx={{
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    opacity: '0.6',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    '&:hover': {
                      backgroundColor: '#ffffff1a',
                      opacity: '0.8',
                    },
                    borderRadius: '10px',
                  }}
                ></SidebarButton>
              );
            }
            return (
              <SidebarButton
                icon={item.icon}
                content={item.content}
                key={index}
                isActive={false}
              ></SidebarButton>
            );
          })}
        </Stack>
        <Stack
          sx={{
            width: '100%',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            borderTop: '1px solid #ffffff1a',
          }}
        >
          <p
            style={{
              textTransform: 'uppercase',
              fontSize: '10px',
            }}
          >
            admins
          </p>
          <SidebarButton
            // onClick={() => router.push(`/spaces/${spaceId}/events/456/edit`)}
            onClick={() => router.push(`/spaces/${spaceId}/events`)}
            content="Manage Events"
            icon={<ManageEventsIcon />}
          ></SidebarButton>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default SubSidebar;
