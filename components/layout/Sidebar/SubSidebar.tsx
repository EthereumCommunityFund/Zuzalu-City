'use client';

import { HomeIcon, SearchIcon, StreamIcon } from 'components/icons';
import SidebarButton from './SidebarButton';
import { ChatsIcon } from 'components/icons/Chats';
import { AnnouncementsIcon } from 'components/icons/Announcements';
import Image from 'next/image';
import { ManageEventsIcon } from 'components/icons/ManageEvents';
import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function SubSidebar() {

  const theme = useTheme();

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
          display: 'block'
        },
        boxSizing: 'border-box',
        fontFamily: 'Inter'
      }}
    >
      <Stack
        sx={{
          width: '100%',
          padding: "10px",
          borderBottom: '1px solid #ffffff1a',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxSizing: 'border-box'
        }}
      >
        <Stack
          sx={{
            width: '100%',
            borderRadius: '10px',
            border: '1px solid #ffffff1a',
            padding: '10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
            overflow: 'hidden',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          <Image
            loader={() =>
              'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512'
            }
            src={
              'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png?scale-down-to=512'
            }
            alt=""
            width={260}
            height={64}
            style={{
              filter: 'blur(50px)',
              position: 'absolute',
              opacity: 0.25,
            }}
          ></Image>
          <Image
            loader={() =>
              'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
            }
            src={
              'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
            }
            width={35}
            height={35}
            className="max-w-[35px] max-h-[35px]"
            alt="Zuzalu City"
          />
          <Typography
            sx={{
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              fontSize: '18px',
              fontWeight: '700',
              lineHeight: '20px'
            }}
          >
            Zuzalu City Contributors
          </Typography>
        </Stack>
        <SidebarButton
          content="Exit Space"
          sx={{
            backgroundColor: '#ffffff05',
            '&:hover': {
              backgroundColor: '#ffffff1a',
              opacity: '1'
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
          boxSizing: 'border-box'
        }}
      >
        <Stack
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '20px 10px',
            boxSizing: 'border-box'
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
                      opacity: '0.8'
                    },
                    borderRadius: '10px'
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
            borderTop: '1px solid #ffffff1a'
          }}
        >
          <p
            style={{
              textTransform: 'uppercase',
              fontSize: '10px'
            }}
          >admins</p>
          <SidebarButton
            content="Manage Events"
            icon={<ManageEventsIcon />}
          ></SidebarButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
