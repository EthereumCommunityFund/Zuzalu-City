'use client';
import * as React from 'react';
import {
  Box,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { SearchIcon, MenuIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showAuthPrompt } = useCeramicContext();
  return (
    <Box
      height="33px"
      bgcolor="#2D2D2D"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingX="10px"
      paddingY="8px"
      borderBottom="1px solid #383838"
      zIndex={1000}
      position="relative"
    >
      <Box display="flex" alignItems="center" gap="10px">
        <MenuIcon />
        <Box
          component="img"
          src={isMobile ? '/ZuCityLogo-IconOnly.svg' : '/ZuCityLogo.svg'}
          height="40px"
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
      <Button
        sx={{
          textAlign: 'center',
          color: 'white',
          fontSize: 16,
          fontFamily: 'Inter',
          fontWeight: 600,
          lineHeight: '19.2px',
          wordWrap: 'break-word',
          background: 'transparent',
          boxShadow: 'none',
          '&:hover': {
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
        onClick={showAuthPrompt}
      >
        Connect
      </Button>
    </Box>
  );
};

export default Header;
