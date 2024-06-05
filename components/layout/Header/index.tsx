'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useTheme, useMediaQuery } from '@mui/material';
import { SearchIcon, MenuIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';

const Header = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { isAuthenticated, showAuthPrompt, logout, username } =
    useCeramicContext();
  console.log('AUth', isAuthenticated, username);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
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
        {isTablet && <MenuIcon />}
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
            <MenuItem>Wallet Connected</MenuItem>
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={() => router.push('/passport')}>
              Passport
            </MenuItem>
            <MenuItem onClick={handleSetting}>Setting</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <Divider />

            <MenuItem onClick={handleMenuClose} style={{ fontSize: '0.8rem' }}>
              Blog
            </MenuItem>
            <MenuItem onClick={handleMenuClose} style={{ fontSize: '0.8rem' }}>
              Privacy
            </MenuItem>
            <MenuItem onClick={handleMenuClose} style={{ fontSize: '0.8rem' }}>
              Terms
            </MenuItem>
            <MenuItem onClick={handleMenuClose} style={{ fontSize: '0.8rem' }}>
              About Zuzalu City
            </MenuItem>
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
    </Box>
  );
};

export default Header;
