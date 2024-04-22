import * as React from 'react';
import { Box, Typography } from '@mui/material';

const Menubar = () => {
  return (
    <Box
      bgcolor="#2b2b2bcc"
      height="45px"
      display="flex"
      gap="10px"
      alignItems="center"
      padding="0px 10px"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
    >
      <Typography
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
      >
        Overview
      </Typography>
      <Typography
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
      >
        Event Sessions
      </Typography>
      <Typography
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
      >
        Venue
      </Typography>
      <Typography
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
        borderBottom="1px solid white"
      >
        Tickets
      </Typography>
      <Typography
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
      >
        Attendees
      </Typography>
    </Box>
  );
};

export default Menubar;
