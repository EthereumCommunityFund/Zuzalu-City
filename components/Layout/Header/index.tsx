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
import { SearchIcon, MenuIcon } from '../../icons';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      height="50px"
      bgcolor="#2D2D2D"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingX="20px"
      paddingY="8px"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
    >
      <Box display="flex" alignItems="center" gap="10px">
        <MenuIcon />
        <Box component="img" src="/logo.webp" height="40px" />
        {!isMobile ? (
          <Box>
            <Box
              component='span'
              sx={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'Merriweather',
              }}
            >
              Zuzalu
            </Box>
            <Box
              component='span'
              sx={{ color: 'white', fontSize: '16px', opacity: 0.3,
              fontFamily: 'Merriweather'
               }}>
              .city
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography
              sx={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'Inter',
                fontStyle: 'italic',
              }}
            >
              beta
            </Typography>
          </Box>
        )}
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
      <Box display="flex" alignItems="center">
        <Button
          sx={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 500,
            fontFamily: 'Inter',
            backgroundColor: '#2d2d2d',
            borderRadius: '10px',
          }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
