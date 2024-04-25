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
      <Box flexGrow={1} display="flex" flexDirection="column" gap="14px">
        <Box display="flex" flexDirection="column">
          <Box
            component="span"
            sx={{
              color: 'white',
              fontSize: '25px',
              fontWeight: 400,
              fontFamily: 'Inter',
            }}
          >
            Zuzalu City Lottery
          </Box>
          <Box
            component="span"
            sx={{
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter',
            }}
          >
            Donate to ZuCity Development for a chance to win!
          </Box>
        </Box>
        <Box
          borderBottom="1px solid rgba(255, 255, 255, 0.10)"
          borderTop="1px solid rgba(255, 255, 255, 0.10)"
          padding="10px"
          display="flex"
          flexDirection="column"
          gap="10px"
        >
          <Box display="flex" gap="10px" alignItems="center">
            <Box
              component="span"
              sx={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
                fontFamily: 'Inter',
              }}
            >
              Prize Pool
            </Box>
            <Box
              component="span"
              sx={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter',
                opacity: 0.8,
              }}
            >
              4.20 ETH
            </Box>
          </Box>
          <Box display="flex" gap="10px" alignItems="center">
            <Box
              component="span"
              sx={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
                fontFamily: 'Inter',
              }}
            >
              Ticket Price
            </Box>
            <Box
              component="span"
              sx={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter',
                opacity: 0.8,
              }}
            >
              0.00069 ETH
            </Box>
          </Box>
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
              fontFamily: 'Inter',
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
              fontFamily: 'Inter',
            }}
            startIcon={<RightArrowIcon />}
          >
            Draw Tickets
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap="5px">
          <Box
            component="span"
            sx={{
              color: 'white',
              fontSize: '13px',
              fontWeight: 500,
              opacity: 0.5,
              fontFamily: 'Inter',
            }}
          >
            Powered by Lotto PGF
          </Box>
          <Box component="img" src="pgf.png" width="18px" height="18px"></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LotteryCard;
