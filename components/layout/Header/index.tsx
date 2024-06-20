'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import styles from './index.module.css';
import { useTheme, useMediaQuery } from '@mui/material';
import { SearchIcon, MenuIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import SidebarDrawer from '../Sidebar/SidebarDrawer';
import { useAppContext } from '@/context/AppContext';
import { useDisconnect } from 'wagmi';
const Header = () => {
  const theme = useTheme();
  const { openSidebar, setOpenSidebar } = useAppContext();
  const router = useRouter();
  const pathName = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { isAuthenticated, showAuthPrompt, logout, username } =
    useCeramicContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { disconnect } = useDisconnect();
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    disconnect();
    logout();
    handleMenuClose();
    window.location.reload();
  };
  const handleProfile = () => {
    handleMenuClose();
  };
  const handleSetting = () => {
    handleMenuClose();
  };

  return (
    <Box
      height="50px"
      bgcolor="#2D2D2D"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingX="10px"
      paddingY="8px"
      borderBottom="1px solid #383838"
      zIndex={1000}
      position={'sticky'}
      top={0}
    >
      <Box
        display="flex"
        alignItems="center"
        gap="10px"
        sx={{ cursor: 'pointer' }}
      >
        {(isTablet ||
          (pathName.split('/')[1] === 'spaces' &&
            pathName.split('/').length > 2)) && (
          <Button
            sx={{
              padding: '10px',
              width: '40px',
              minWidth: 'unset',
            }}
            onClick={() => setOpenSidebar(true)}
          >
            <MenuIcon />
          </Button>
        )}

        <Box
          component="img"
          src={isMobile ? '/ZuCityLogo-IconOnly.svg' : '/ZuCityLogo.svg'}
          height="40px"
          onClick={() => router.push('/')}
        />
        <Typography
          variant="body2"
          color={theme.palette.text.primary}
          sx={{
            fontStyle: 'italic',
            opacity: 0.8,
          }}
        >
          beta
        </Typography>
      </Box>
      {isAuthenticated ? (
        <>
          <Button
            sx={{
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: 600,
              lineHeight: '19.2px',
              wordWrap: 'break-word',
              background: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.05)',
                boxShadow: 'none',
              },
            }}
            onClick={handleMenuClick}
          >
            {username}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                style: {
                  backgroundColor: 'black',
                },
              },
            }}
          >
            <MenuItem>{username}</MenuItem>
            <MenuItem>
              <span className={'text'}>Wallet Connected</span>
            </MenuItem>
            <MenuItem onClick={handleProfile}>
              <span className={styles.text}>Profile</span>
            </MenuItem>
            {/* <MenuItem onClick={() => router.push('/passport')}>
              <span className={styles.text}>Passport</span>
            </MenuItem> */}
            {/*<MenuItem onClick={handleSetting}>Setting</MenuItem>*/}
            <MenuItem onClick={handleLogout}>
              <span className={styles.text}>Logout</span>
            </MenuItem>
            <Divider />

            {/*<MenuItem onClick={handleMenuClose} style={{ fontSize: '0.8rem' }}>*/}
            {/*  <span className={styles.text}>Blog</span>*/}
            {/*</MenuItem>*/}
            {/*<MenuItem onClick={handleMenuClose} style={{ fontSize: '0.8rem' }}>*/}
            {/*  <span className={styles.text}>Privacy</span>*/}
            {/*</MenuItem>*/}
            {/*<MenuItem onClick={handleMenuClose} style={{ fontSize: '0.8rem' }}>*/}
            {/*  <span className={styles.text}>Terms</span>*/}
            {/*</MenuItem>*/}
            {/*<MenuItem onClick={handleMenuClose} style={{ fontSize: '0.8rem' }}>*/}
            {/*  <span className={styles.text}>About Zuzalu City</span>*/}
            {/*</MenuItem>*/}
          </Menu>
        </>
      ) : (
        <Button
          sx={{
            textAlign: 'center',
            color: 'white',
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: 600,
            lineHeight: '19.2px',
            wordWrap: 'break-word',
            background: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.05)',
              boxShadow: 'none',
            },
          }}
          onClick={showAuthPrompt}
        >
          Connect
        </Button>
      )}
      <SidebarDrawer
        selected={'Home'}
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />
    </Box>
  );
};

export default Header;
