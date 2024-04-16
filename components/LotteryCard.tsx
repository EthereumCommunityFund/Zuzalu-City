import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { LotteryIcon, RightArrowIcon } from './icons';

const LotteryCard: React.FC = () => {
  return (
    <Box
      padding="20px"
      display="flex"
      gap="10px"
      bgcolor="#2D2D2D"
      borderRadius="20px"
      marginY="30px"
    >
      <Box>
        <LotteryIcon />
      </Box>
      <Box flexGrow={1} display="flex" flexDirection="column" gap="30px">
        <Box>
          <Typography color="white" fontSize="31px" fontWeight={400}>
            Zuzalu City Lottery
          </Typography>
          {/* <Typography color='white' fontSize='16px' fontweight={600}>Donate to ZuCity Development for a chance to win!</Typography> */}
        </Box>
        <Box
          borderBottom="1px solid rgba(255, 255, 255, 0.10)"
          borderTop="1px solid rgba(255, 255, 255, 0.10)"
          padding="10px"
          display="flex"
          flexDirection="column"
          gap="10px"
        >
          {/* <Typography color='white' fontSize='16px' fontweight={600}>Prize Pool</Typography> */}
          {/* <Typography color='white' fontSize='16px' fontweight={600}>Prize Pool</Typography> */}
        </Box>
        <Box display="flex" gap="20px">
          <Button
            sx={{
              backgroundColor: '#383838',
              color: 'white',
              fontSize: '18px',
              fontWeight: 600,
              borderRadius: '10px',
              padding: '10px 14px',
            }}
            startIcon={<RightArrowIcon />}
          >
            Donate Directly
          </Button>
          <Button
            sx={{
              backgroundColor: '#383838',
              color: 'white',
              fontSize: '18px',
              fontWeight: 600,
              borderRadius: '10px',
              padding: '10px 14px',
            }}
            startIcon={<RightArrowIcon />}
          >
            Draw Tickets
          </Button>
        </Box>
        {/* <Typography color='white' fontSize='13px' fontweight={500} opacity={0.8} display='flex' gap='5px'> */}
        {/* Powered by Lotto PGF */}
        {/* <Box component='img' src='pgf.png' width='18px' height='18px'></Box> */}
        {/* </Typography> */}
      </Box>
    </Box>
  );
};

export default LotteryCard;
