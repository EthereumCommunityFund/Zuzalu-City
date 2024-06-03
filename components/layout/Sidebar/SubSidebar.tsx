'use client';
import React, { useState } from 'react';
import {
  HomeIcon,
  SettingIcon,
  UserPlusIcon,
  ShieldIcon,
  NotificationIcon,
  TableIcon,
  ChevronDownIcon
} from 'components/icons';
import SidebarButton from './SidebarButton';
import { Stack, Typography, Box, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

interface SubSidebarProps {
  spaceId: string;
  title?: string;
}

const SubSidebar: React.FC<SubSidebarProps> = ({ spaceId, title }) => {
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
        <Stack spacing="10px" onMouseLeave={handleClose}>
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
            onClick={handleClick}
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
            <ChevronDownIcon size={5} />
          </Stack>
          <Popover
            sx={{ width: '100%' }}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Stack
              spacing="10px"
              padding="5px"
              border="1px solid #383838"
              borderRadius="5px"
              bgcolor="black"
              color="white"
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
          </Popover>
        </Stack>
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
          <SidebarButton icon={<HomeIcon />} content="Home" isActive={false} />
          <SidebarButton
            icon={<TableIcon />}
            content="Events"
            isActive={false}
            onClick={() => router.push(`/spaces/${spaceId}/events`)}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SubSidebar;
