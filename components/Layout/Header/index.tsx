import * as React from 'react';
import {
  Box,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { SearchIcon, MenuIcon } from '../../icons';

const Header: React.FC = () => {
  return (
    <Box
      height="50px"
      bgcolor="#2D2D2D"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingX="20px"
      paddingY="8px"
    >
      <Box display="flex" alignItems="center" gap="10px">
        <MenuIcon />
        <Box component="img" src="logo.webp" height="40px" />
        <Box display="flex" alignItems="end">
          <Box>
            <Typography
              sx={{
                color: 'white',
                fontSize: '30px',
                fontWeight: 700,
                fontFamily: 'Roboto',
              }}
            >
              Zuzalu
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: 'grey', fontSize: '18px' }}>
              .city
            </Typography>
          </Box>
        </Box>
      </Box>
      <FormControl focused sx={{ width: '30%', border: 'none' }}>
        <OutlinedInput
          placeholder="Search"
          sx={{
            backgroundColor: 'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
            paddingX: '15px',
            paddingY: '13px',
            borderRadius: '10px',
            height: '35px',
            border: '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
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
      <Box display="flex" gap="10px">
        <Box component="img" src="drivenfast.webp" height="30px" />
      </Box>
    </Box>
  );
};

export default Header;
