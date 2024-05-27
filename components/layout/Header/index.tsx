'use client';
import React, {
  useState,
  useEffect,
  Fragment,
  ReactNode,
  useCallback,
} from 'react';
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
import { authenticateCeramic } from '@/utils/ceramicAuth';
const Header = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  /*const {
    ceramic,
    composeClient,
    isAuthenticated,
    showAuthPrompt,
    logout,
    username,
  } = useCeramicContext();*/
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const handleLogin = useCallback(async () => {
    const accounts = await authenticateCeramic(ceramic, composeClient);
    return accounts;
  }, [ceramic, composeClient]);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    //logout();
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
        <MenuIcon />
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
      {!isMobile && (
        <FormControl focused sx={{ width: '30%', border: 'none' }}>
          <OutlinedInput
            placeholder="Search"
            sx={{
              backgroundColor:
                'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
              paddingX: '15px',
              paddingY: '13px',
              borderRadius: '10px',
              height: '35px',
              border: '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
              fontFamily: 'Inter',
              opacity: 0.7,
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </FormControl>
      )}
      {/*isAuthenticated ? (
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
          onClick={async () => {
            await handleLogin();
            window.location.href = '/';
          }}
        >
          Connect
        </Button>
      )*/}
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
        onClick={async () => {
          await handleLogin();
          window.location.href = '/';
        }}
      >
        Connect
      </Button>
    </Box>
  );
};

export default Header;
