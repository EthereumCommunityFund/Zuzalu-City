import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { LeftArrowIcon } from 'components/icons';

const Navbar = () => {
  return (
    <Box
      bgcolor="#2b2b2bcc"
      height="50px"
      display="flex"
      gap="20px"
      alignItems="center"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
    >
      <Button
        startIcon={<LeftArrowIcon />}
        sx={{
          fontFamily: 'Inter',
          fontWeight: 700,
          color: 'white',
          '&:hover': {
            backgroundColor: '#2d2d2d',
          },
        }}
      >
        Back
      </Button>
      <Typography
        color="white"
        fontFamily="Inter"
        fontSize="18px"
        fontWeight={700}
      >
        ZuVillage Georgia
      </Typography>
    </Box>
  );
};

export default Navbar;
