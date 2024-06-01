'use client';
import React, { useState } from 'react';
import {
  ChevronDownIcon,
  HomeIcon,
  NotificationIcon,
  SettingIcon,
  ShieldIcon,
  TableIcon,
  UserPlusIcon,
} from 'components/icons';
import SidebarButton from './SidebarButton';
import { Box, Popover, Stack, StackProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import styles from './SubSidebar.module.css';

interface SubSidebarProps {
  spaceId: string;
  title?: string;
}

const MenuItem: React.FC<
  React.PropsWithChildren<StackProps & { text: string }>
> = (props) => {
  const { children, text, ...rest } = props;
  return (
    <Stack
      className={styles.menu}
      direction="row"
      justifyContent="space-between"
      padding="6px 10px"
      alignItems="center"
      borderRadius="8px"
      {...rest}
    >
      <Typography className={styles.text} fontSize={'13px'}>
        {text}
      </Typography>
      <span className={styles.icon}>{children}</span>
    </Stack>
  );
};

const SubSidebar: React.FC<SubSidebarProps> = ({ spaceId, title }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isMenu, setIsMenu] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

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
          <div className={styles.spaceButton}>
            <Stack
              borderRadius="10px"
              padding="10px 14px"
              direction="row"
              spacing="10px"
              alignItems="center"
              sx={{
                cursor: 'pointer',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(34,34,34,0.1)',
                backdropFilter: 'blur(10px)',
              }}
              onClick={handleClick}
            >
              <Box
                component="img"
                width={35}
                height={35}
                borderRadius={'100%'}
                src="/1.webp"
              />
              <Typography
                flex={1}
                variant="subtitleS"
                color="white"
                fontSize={'18px'}
                lineHeight={'22px'}
                sx={{ textWrap: 'wrap' }}
              >
                {title}
              </Typography>
              <ChevronDownIcon size={5} />
            </Stack>
          </div>
          <Popover
            sx={{ width: '100%', marginTop: '14px' }}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: 'transparent',
              },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Stack
              padding={'10px'}
              spacing="10px"
              border="1px solid rgba(255, 255, 255, 0.2)"
              borderRadius="10px"
              bgcolor="black"
              color="white"
              sx={{
                minWidth: '240px',
                width: '240px',
              }}
            >
              <MenuItem
                text={'Invite People'}
                onClick={() => router.push(`/spaces/${spaceId}/edit/invite`)}
              >
                <UserPlusIcon size={5} />
              </MenuItem>
              <MenuItem
                onClick={() => router.push(`/spaces/${spaceId}/edit`)}
                text={'Space Settings'}
              >
                <SettingIcon size={5} />
              </MenuItem>
              <MenuItem
                onClick={() => router.push(`/spaces/${spaceId}/edit`)}
                text={'Privacy Settings'}
              >
                <ShieldIcon size={5} />
              </MenuItem>
              <MenuItem
                onClick={() => router.push(`/spaces/${spaceId}/edit`)}
                text={'Notification Settings'}
              >
                <NotificationIcon size={5} />
              </MenuItem>
            </Stack>
          </Popover>
          {/* {isMenu && (
          )} */}
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
          <SidebarButton icon={<HomeIcon />} content="Home" isActive={false} />
          {/*<SidebarButton*/}
          {/*  icon={<AnnouncementsIcon />}*/}
          {/*  content="Announcements"*/}
          {/*  isActive={false}*/}
          {/*/>*/}
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
