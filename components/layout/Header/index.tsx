'use client';
import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider,
  Stack,
} from '@mui/material';
import styles from './index.module.css';
import { useTheme, useMediaQuery } from '@mui/material';
import { MenuIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import SidebarDrawer from '../Sidebar/SidebarDrawer';
import { useAppContext } from '@/context/AppContext';
import { useAccount, useDisconnect, useEnsName } from 'wagmi';
import Image from 'next/image';

export function formatAddressString(str?: string, maxLength: number = 10) {
  if (!str) return;
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, 4) + '...' + str.substring(str.length - 4);
}

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
  const { address } = useAccount();
  const ensNameData = useEnsName({
    address,
  });
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

  const userName = useMemo(() => {
    if (address) {
      return (
        formatAddressString(ensNameData.data?.toString(), 16) ||
        formatAddressString(address)
      );
    }
  }, [address, ensNameData.data]);

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
          alpha
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
              wordWrap: 'break-word',
              background: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.05)',
                boxShadow: 'none',
              },
              gap: '8px',
              borderRadius: '10px',
            }}
            onClick={handleMenuClick}
          >
            <Image
              src="/user/avatar_p.png"
              alt="avatar"
              height={24}
              width={24}
            />
            {username}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                style: {
                  backgroundColor: 'rgba(34, 34, 34)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 9999,
                  padding: '2px 10px',
                  width: '244px',
                  marginTop: '8px',
                },
              },
            }}
          >
            <Stack flexDirection="column" sx={{ gap: '10px' }}>
              <Stack
                flexDirection="row"
                alignItems="center"
                sx={{
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                }}
              >
                <Image
                  src="/user/avatar_p.png"
                  alt="avatar"
                  height={40}
                  width={40}
                />
                <Stack
                  sx={{ marginTop: 0 }}
                  spacing="4px"
                  flexDirection="column"
                >
                  <Typography variant="bodyBB">{userName}</Typography>
                  <Typography variant="bodyM" color="text.secondary">
                    Wallet Connected
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                flexDirection="row"
                alignItems="center"
                sx={{
                  gap: '10px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  opacity: '0.8',
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                  },
                }}
                onClick={handleProfile}
              >
                <Image
                  src="/user/profile.png"
                  alt="profile"
                  height={24}
                  width={24}
                />
                <Typography
                  sx={{
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  My Profile
                </Typography>
              </Stack>
              <Stack
                flexDirection="column"
                sx={{
                  gap: '4px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  opacity: '0.8',
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                  },
                }}
              >
                <Stack
                  flexDirection="row"
                  alignItems="center"
                  sx={{ gap: '10px' }}
                >
                  <Image
                    src="/user/wallet.png"
                    alt="wallet"
                    height={24}
                    width={24}
                  />
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  >
                    My Passport
                  </Typography>
                </Stack>
                <Typography variant="caption">Passport Coming soon</Typography>
              </Stack>
              <Stack
                flexDirection="row"
                alignItems="center"
                sx={{
                  gap: '10px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 94, 94, 0.05)',
                  borderRadius: '10px',
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255, 94, 94, 0.1)',
                  },
                }}
                onClick={handleLogout}
              >
                <Image
                  src="/user/logout.png"
                  alt="logout"
                  height={24}
                  width={24}
                />
                <Typography
                  sx={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#FF5E5E',
                  }}
                >
                  Logout
                </Typography>
              </Stack>
            </Stack>
          </Menu>
        </>
      ) : (
        /*<Button
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
            gap: '8px',
            borderRadius: '10px',
          }}
          onClick={showAuthPrompt}
        >
          <Image src="/user/wallet.png" alt="wallet" height={24} width={24} />
          Connect
        </Button>*/
        <Image src="/user/avatar_p.png" alt="avatar" height={30} width={30} />
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
