import {
  CopyIcon,
  GoToExplorerIcon,
  ScrollIcon,
  USDTIcon,
} from '@/components/icons';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { SendNFTTicket, WithdrawToken } from './component';
import React from 'react';

const TicketVault = () => {
  const [action, setAction] = React.useState('Withdraw');

  const isMobile = useMediaQuery('(max-width:500px)');
  return (
    <Stack sx={{ background: '#222', height: '100%' }}>
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '10px 10px 20px',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2.5}
          marginTop={'10px'}
        >
          <Image
            style={{
              width: '100%',
              height: 'auto',
            }}
            alt={'/24.webp'}
            src={'/24.webp'}
            width={100}
            height={100}
          />

          <Stack direction="column" spacing={0.9}>
            <Typography
              variant="h5"
              fontSize="24px"
              fontFamily={'Inter'}
              lineHeight={'120%'}
              color="white"
            >
              TicketName
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="14px"
                fontFamily={'Inter'}
                lineHeight={'160%'}
                color="white"
                sx={{ opacity: '0.6' }}
              >
                Status:
              </Typography>{' '}
              <Typography
                fontSize="16px"
                color="#7DFFD1"
                fontWeight={'600'}
                lineHeight={'120%'}
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                Available: To All
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="14px"
                fontFamily={'Inter'}
                lineHeight={'160%'}
                color="white"
                sx={{ opacity: '0.6' }}
              >
                Price:
              </Typography>
              <Typography
                fontSize="16px"
                color="white"
                fontWeight={'700'}
                lineHeight={'120%'}
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                120
              </Typography>
              <Typography
                fontSize="10px"
                color="white"
                fontWeight={'400'}
                marginLeft={'2px'}
                lineHeight={'120%'}
                letterSpacing={'0.2'}
                sx={{
                  opacity: '0.8',
                }}
              >
                USDT
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="14px"
                fontFamily={'Inter'}
                lineHeight={'160%'}
                color="white"
                sx={{ opacity: '0.6' }}
              >
                Address:
              </Typography>
              <Typography
                fontSize="14px"
                color="white"
                fontWeight={'400'}
                lineHeight={'160%'}
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                0x9999...f08E
                {/* 0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E */}
              </Typography>

              <Box marginLeft={'4px'} sx={{ cursor: 'pointer' }}>
                <CopyIcon cursor="pointer" />
              </Box>

              <Box marginLeft={'4px'} sx={{ cursor: 'pointer' }}>
                <GoToExplorerIcon cursor="pointer" />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="14px"
                fontFamily={'Inter'}
                lineHeight={'160%'}
                color="white"
                sx={{ opacity: '0.6' }}
              >
                Controller:
              </Typography>
              <Typography
                fontSize="14px"
                color="white"
                fontWeight={'400'}
                lineHeight={'160%'}
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                etherbro.eth
              </Typography>

              <Box marginLeft={'4px'} sx={{ cursor: 'pointer' }}>
                <CopyIcon cursor="pointer" />
              </Box>

              <Box marginLeft={'4px'} sx={{ cursor: 'pointer' }}>
                <GoToExplorerIcon cursor="pointer" />
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Stack padding={'20px'}>
        <Box marginBottom={'20px'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '14px',
            }}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Total Revenue:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="18px"
                color="white"
                fontWeight={'700'}
                lineHeight={'120%'}
              >
                1680
              </Typography>
              <Typography
                fontSize="10px"
                color="white"
                fontWeight={'400'}
                marginLeft={'4px'}
                lineHeight={'120%'}
                letterSpacing={'0.2'}
                sx={{
                  opacity: '0.5',
                }}
              >
                USDT
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Receiving Token:
            </Typography>
            <Box
              padding={'4px 10px'}
              borderRadius="10px"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <USDTIcon />
              <Typography
                fontSize="14px"
                color="white"
                marginLeft="8px"
                fontWeight={'600'}
                lineHeight={'160%'}
              >
                USDT
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Quantity:
            </Typography>
            <Typography
              fontSize="16px"
              color="white"
              fontWeight={'700'}
              lineHeight={'120%'}
            >
              200
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Total Sold:
            </Typography>
            <Typography
              fontSize="16px"
              color="white"
              fontWeight={'700'}
              lineHeight={'120%'}
            >
              14
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Transactions:
            </Typography>
            <Box
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Typography
                fontSize="16px"
                color="white"
                fontWeight={'700'}
                lineHeight={'120%'}
                marginRight={'5px'}
              >
                Scrollscan
              </Typography>
              <GoToExplorerIcon cursor="pointer" />
            </Box>
          </Box>
        </Box>
      </Stack>

      <Box
        padding={3}
        marginX={isMobile ? undefined : 3}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
        }}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          sx={{
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <Typography
            onClick={() => setAction('Withdraw')}
            textAlign={'center'}
            paddingY={'8px'}
            width={'100%'}
            sx={{
              cursor: 'pointer',
              borderRadius: `${action === 'Withdraw' ? '8px' : null}`,
              border: `${action === 'Withdraw' ? '1px solid rgba(255, 255, 255, 0.10)' : null}`,
              background: `${action === 'Withdraw' ? 'rgba(255, 255, 255, 0.10)' : null}`,
            }}
          >
            Withdraw Token
          </Typography>
          <Typography
            onClick={() => setAction('SendTicket')}
            textAlign={'center'}
            width={'100%'}
            paddingY={'8px'}
            sx={{
              cursor: 'pointer',
              borderRadius: `${action === 'SendTicket' ? '8px' : null}`,
              border: `${action === 'SendTicket' ? '1px solid rgba(255, 255, 255, 0.10)' : null}`,
              background: `${action === 'SendTicket' ? 'rgba(255, 255, 255, 0.10)' : null}`,
            }}
          >
            Send Ticket
          </Typography>
        </Box>

        {action === 'Withdraw' ? <WithdrawToken /> : <SendNFTTicket />}
      </Box>

      <Box display="flex" marginTop={'20px'} justifyContent={'center'}>
        <ScrollIcon />
      </Box>
    </Stack>
  );
};

export default TicketVault;
