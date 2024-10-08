'use client';
import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import { LeftArrowIcon } from 'components/icons';

interface PropTypes {
  spaceName?: string;
}

const Navbar = ({ spaceName = '' }: PropTypes) => {
  const router = useRouter();
  const params = useParams();

  return (
    <Box
      bgcolor="#2b2b2bcc"
      height="50px"
      display="flex"
      gap="20px"
      alignItems="center"
      borderBottom="1px solid #383838"
      paddingX={'20px'}
    >
      <Button
        onClick={() =>
          router.push(`/spaces/${params.spaceid.toString()}/adminevents`)
        }
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
        {spaceName}
      </Typography>
    </Box>
  );
};

export default Navbar;
