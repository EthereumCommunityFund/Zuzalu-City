import * as React from 'react';
import { Box, Button, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { LotteryIcon, RightArrowIcon } from '../icons';
import { useCallback, useEffect } from 'react';
import abi from './lotteryAbi';
import { ethers } from 'ethers';

interface IProps {
  inEvent?: boolean;
}

const LotteryCard = ({ inEvent = false }: IProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const [lotteryInfo, setLotteryInfo] = React.useState<{
    ticketPrice: string;
    jackpot: string;
  }>({ jackpot: '', ticketPrice: '' });

  useEffect(() => {
    const fetch = async () => {
      const provider = new ethers.JsonRpcProvider('https://scroll.drpc.org');

      const contractAddress = '0x9cc55b4e4b29b6b4a644be9bcbdb8ad253696111';
      const contractABI = abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider,
      );
      const [ticketPrice, jackpot] = await Promise.all([
        contract.ticketPrice(),
        contract.jackpot(),
      ]);
      setLotteryInfo({
        ticketPrice: ethers.formatUnits(ticketPrice, 18),
        jackpot: ethers.formatUnits(jackpot, 18),
      });
    };
    fetch();
  }, []);

  const handleClick = useCallback(() => {
    window.open('https://zuzalotto.vercel.app/');
  }, []);

  const hasNewLayout = inEvent ? !isMd : isMobile;

  return (
    <Box
      padding="20px"
      display="flex"
      gap="10px"
      bgcolor="#2D2D2D"
      width={'100%'}
      boxSizing={'border-box'}
      borderRadius="20px"
      marginY="30px"
    >
      <Box display={hasNewLayout ? 'none' : 'block'}>
        <LotteryIcon />
      </Box>
      <Box
        flex={8}
        display="flex"
        flexDirection="column"
        gap={hasNewLayout ? '10px' : '14px'}
      >
        <Box
          display={!hasNewLayout ? 'none' : 'block'}
          marginBottom={hasNewLayout ? '-10px' : 0}
        >
          <LotteryIcon width={40} height={40} />
        </Box>
        <Box display="flex" flexDirection="column">
          <Box
            component="span"
            sx={{
              color: 'white',
              fontSize: hasNewLayout ? '20px' : '25px',
              fontWeight: 500,
              fontFamily: 'Inter',
              marginBottom: '5px',
            }}
          >
            Zuzalu City Lottery
          </Box>
          <Box
            component="span"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
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
                fontWeight: 600,
                fontFamily: 'Inter',
              }}
            >
              Prize Pool
            </Box>
            <Box
              component="span"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'Inter',
              }}
            >
              {lotteryInfo.jackpot ? (
                `${lotteryInfo.jackpot} ETH`
              ) : (
                <Skeleton variant="text" width={80} />
              )}
            </Box>
          </Box>
          <Box display="flex" gap="10px" alignItems="center">
            <Box
              component="span"
              sx={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: 'Inter',
              }}
            >
              Ticket Price
            </Box>
            <Box
              component="span"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'Inter',
              }}
            >
              {lotteryInfo.ticketPrice ? (
                `${lotteryInfo.ticketPrice} ETH`
              ) : (
                <Skeleton variant="text" width={80} />
              )}
            </Box>
          </Box>
        </Box>
        <Box display="flex" gap="20px">
          <Button
            sx={{
              backgroundColor: '#383838',
              color: 'white',
              fontSize: '18px',
              lineHeight: '22px',
              fontWeight: 600,
              borderRadius: '10px',
              padding: hasNewLayout ? '5px 0' : '10px 14px',
              fontFamily: 'Inter',
              width: hasNewLayout ? '100%' : 'auto',
            }}
            startIcon={<RightArrowIcon />}
            onClick={handleClick}
          >
            Get Your Tickets
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap="5px">
          <Box
            component="span"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '13px',
              fontWeight: 400,
              fontFamily: 'Inter',
            }}
          >
            Powered by Lotto PGF
          </Box>
          <Box component="img" src="/pgf.png" width="18px" height="18px"></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LotteryCard;
