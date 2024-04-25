import * as React from 'react';
import { Box, Typography } from '@mui/material';

interface TabbarProps {
  tabName: string;
  setTabName:  (value: string | ((prevVar: string) => string)) => void;
}

const Tabbar: React.FC<TabbarProps> = ({ tabName, setTabName }) => {
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
        onClick={() => setTabName('Overview')}
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
        borderBottom={tabName === 'Overview' ? "1px solid white" : "none"}
        sx={{ cursor: 'pointer' }}
      >
        Overview
      </Typography>
      <Typography
        onClick={() => setTabName('Event Sessions')}
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
        borderBottom={tabName === 'Event Sessions' ? "1px solid white" : "none"}
        sx={{ cursor: 'pointer' }}
      >
        Event Sessions
      </Typography>
      <Typography
        onClick={() => setTabName('Values')}
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
        borderBottom={tabName === 'Venue' ? "1px solid white" : "none"}
        sx={{ cursor: 'pointer' }}
      >
        Venue
      </Typography>
      <Typography
        onClick={() => setTabName('Tickets')}  
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
        borderBottom={tabName === 'Tickets' ? "1px solid white" : "none"}
        sx={{ cursor: 'pointer' }}
      >
        Tickets
      </Typography>
      <Typography
        onClick={() => setTabName('Attendees')}
        color="white"
        fontFamily="Inter"
        fontSize="15px"
        fontWeight={600}
        paddingX="10px"
        height="100%"
        lineHeight="45px"
        borderBottom={tabName === 'Attendees' ? "1px solid white" : "none"}
        sx={{ cursor: 'pointer' }}
      >
        Attendees
      </Typography>
    </Box>
  );
};

export default Tabbar;
