'use client';
import React, { useState } from 'react';
import {
  HomeIcon,
  SettingIcon,
  ArrowDownIcon,
  AnnouncementsIcon,
  ManageEventsIcon,
  UserPlusIcon,
  ShieldIcon,
  NotificationIcon,
  TableIcon
} from 'components/icons';
import SidebarButton from './SidebarButton';
import { Stack, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

interface SubSidebarProps {
  spaceId: string;
  title?: string;
}

const SubSidebar: React.FC<SubSidebarProps> = ({ spaceId, title }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isMenu, setIsMenu] = useState<boolean>(false);

  const buttonList = [
    {
      content: 'Home',
      icon: <HomeIcon />,
    },
    {
      content: 'Announcements',
      icon: <AnnouncementsIcon />,
    },
    {
      content: 'Events',
      icon: <TableIcon />,
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
        <Stack spacing="10px" onMouseLeave={() => setIsMenu(false)}>
          <Stack
            bgcolor="#525554"
            borderRadius="10px"
            border="1px solid #383838"
            padding="10px"
            direction="row"
            spacing="10px"
            alignItems="center"
            sx={{
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              '&:hover': { backgroundColor: '#6f7672' },
            }}
            onClick={() => setIsMenu(true)}
          >
            <Box
              component="img"
              width={40}
              height={40}
              borderRadius={20}
              src="/1.webp"
            />
            <Typography
              flex={1}
              variant="subtitleS"
              color="white"
              sx={{ textWrap: 'wrap' }}
            >
              {title}
            </Typography>
            <ArrowDownIcon size={5} />
          </Stack>
          {isMenu && (
            <Stack
              spacing="10px"
              padding="5px"
              border="1px solid #383838"
              borderRadius="10px"
            >
              <Stack
                onClick={() => router.push(`/spaces/${spaceId}/edit/invite`)}
                direction="row"
                justifyContent="space-between"
                padding="6px 10px"
                alignItems="center"
                borderRadius="8px"
                sx={{
                  '&:hover': {
                    backgroundColor: '#ffffff1a',
                    opacity: '0.8',
                    cursor: 'pointer',
                  },
                }}
              >
                <Typography variant="bodySB">Invite People</Typography>
                <UserPlusIcon size={5} />
              </Stack>
              <Stack
                onClick={() => router.push(`/spaces/${spaceId}/edit`)}
                direction="row"
                justifyContent="space-between"
                padding="6px 10px"
                alignItems="center"
                borderRadius="8px"
                sx={{
                  '&:hover': {
                    backgroundColor: '#ffffff1a',
                    opacity: '0.8',
                    cursor: 'pointer',
                  },
                }}
              >
                <Typography variant="bodySB">Space Settings</Typography>
                <SettingIcon size={5} />
              </Stack>
              <Stack
                onClick={() => router.push(`/spaces/${spaceId}/edit`)}
                direction="row"
                justifyContent="space-between"
                padding="6px 10px"
                alignItems="center"
                borderRadius="8px"
                sx={{
                  '&:hover': {
                    backgroundColor: '#ffffff1a',
                    opacity: '0.8',
                    cursor: 'pointer',
                  },
                }}
              >
                <Typography variant="bodySB">Privacy Settings</Typography>
                <ShieldIcon size={5} />
              </Stack>
              <Stack
                onClick={() => router.push(`/spaces/${spaceId}/edit`)}
                direction="row"
                justifyContent="space-between"
                padding="6px 10px"
                alignItems="center"
                borderRadius="8px"
                sx={{
                  '&:hover': {
                    backgroundColor: '#ffffff1a',
                    opacity: '0.8',
                    cursor: 'pointer',
                  },
                }}
              >
                <Typography variant="bodySB">Notification Settings</Typography>
                <NotificationIcon size={5} />
              </Stack>
            </Stack>
          )}
        </Stack>
        {/* <SidebarButton
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
        ></SidebarButton> */}
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
          {/* {buttonList.map((item, index) => {
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
          })} */}
          <SidebarButton
            icon={<HomeIcon />}
            content="Home"
            isActive={false}
          />
          <SidebarButton
            icon={<AnnouncementsIcon />}
            content="Announcements"
            isActive={false}
          />
          <SidebarButton
            icon={<TableIcon />}
            content="Events"
            isActive={false}
            onClick={() => router.push(`/spaces/${spaceId}/events`)}
          />
        </Stack>
        {/* <Stack
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
        </Stack> */}
      </Stack>
    </Stack>
  );
};

export default SubSidebar;
