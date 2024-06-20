import {
  CopyIcon,
  GoToExplorerIcon,
  ScrollIcon,
  USDTIcon,
} from '@/components/icons';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { SendNFTTicket, WithdrawToken, Whitelist } from './component';
import * as React from 'react';
import { ethers } from 'ethers';
import ContractAbi from '@/contracts/ticektContract.json';
const TicketVault = () => {
  const [action, setAction] = React.useState('Withdraw');
  const isMobile = useMediaQuery('(max-width:500px)');
  const [price, setPrice] = React.useState('');
  const [receiveToken, setReceiveToken] = React.useState('');
  const [revenue, setRevenue] = React.useState('');
  const [sold, setSold] = React.useState(0);
  async function getContractData() {
    const abi = ContractAbi;
    const provider = new ethers.JsonRpcProvider(
      'https://scroll-sepolia.drpc.org',
    );
    const contract = new ethers.Contract(
      '0x1CACDa81696334385f5cFD95497150dD8b5d4a55',
      abi,
      provider,
    );
    /*const erc20Abi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
    ];

    const paymentTokenAddress = await contract.paymentToken();
    const tokenContract = new ethers.Contract(
      paymentTokenAddress,
      erc20Abi,
      provider,
    );

    const tokenName = await tokenContract.name();*/

    const ticketPriceBigNumber = await contract.ticketPrice();
    const ticketPriceBigInt = BigInt(ticketPriceBigNumber.toString());

    /*let totalRevenueBigInt = BigInt(0);

    const filter = contract.filters.TicketMinted();
    const events = await contract.queryFilter(filter);
    const totalSold = events.length;

    events.forEach(() => {
      totalRevenueBigInt += ticketPriceBigInt;
    });
    setRevenue(totalRevenueBigInt.toString());*/
    //setReceiveToken(tokenName);
    setPrice(ethers.formatEther(ticketPriceBigNumber));
    //setSold(totalSold);
  }

  React.useEffect(() => {
    const fetchContractData = async () => {
      try {
        await getContractData();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchContractData();
  }, []);

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
          <Box
            component="img"
            width="100px"
            height="100px"
            borderRadius="8px"
            src="/24.webp"
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
                {price}
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
                {receiveToken}
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
                {/* 0x9999...f08E */}
                0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E
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
                {revenue}
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
                {receiveToken}
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
                {receiveToken}
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
              {sold}
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

      <Stack
        padding="20px"
        spacing="30px"
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
            onClick={() => setAction('Whitelist')}
            textAlign={'center'}
            width={'100%'}
            paddingY={'8px'}
            sx={{
              cursor: 'pointer',
              borderRadius: `${action === 'Whitelist' ? '8px' : null}`,
              border: `${action === 'Whitelist' ? '1px solid rgba(255, 255, 255, 0.10)' : null}`,
              background: `${action === 'Whitelist' ? 'rgba(255, 255, 255, 0.10)' : null}`,
            }}
          >
            Whitelist
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
        </Box>

        {action === 'Withdraw' ? (
          <WithdrawToken />
        ) : action === 'SendTicket' ? (
          <SendNFTTicket />
        ) : (
          <Whitelist />
        )}
      </Stack>

      <Stack
        direction="row"
        marginTop={'20px'}
        justifyContent="center"
        spacing="10px"
        alignItems="center"
      >
        <Typography variant="caption">POWERED BY</Typography>
        <ScrollIcon />
      </Stack>
    </Stack>
  );
};

export default TicketVault;
