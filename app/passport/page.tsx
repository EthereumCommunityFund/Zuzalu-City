'use client';
import * as React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { MOCK_DATA } from 'mock';
import { ArrowForwardIcon, QRCodeIcon } from '@/components/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  return (
    <Stack
      justifyContent={'center'}
      padding="30px"
      spacing="40px"
      sx={{ margin: '0 auto' }}
      maxWidth={'640px'}
    >
      <Stack pb="30px" borderBottom="1px solid #383838" spacing="40px" sx={{ cursor: "pointer" }}
        onClick={() => router.push(`/passport/scanqr/${1}`)}>
        <Typography
          color="white"
          variant="subtitleLB"
        >
          Your Passport
        </Typography>
        <Stack direction="row" spacing="14px" padding="10px" alignItems="center" bgcolor="#262626" borderRadius="10px">
          <QRCodeIcon />
          <Stack spacing="4px">
            <Typography variant="subtitleSB" color="white">
              Scan QR Code
            </Typography>
            <Typography variant="caption" color="white">
              Scan tickets
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack spacing="30px" pb="30px" borderBottom="1px solid #383838">
        <Typography
          color="white"
          variant="subtitleMB"
        >
          ScrollPass Credentials
        </Typography>
        <Stack spacing="10px">
          {MOCK_DATA.eventCredential.map((item, index) => (
            <Stack
              sx={{ cursor: "pointer" }}
              onClick={() => router.push(`passport/${index}`)}
              key={`Scrollpass-Credential-${index}`} direction="row" spacing="14px" padding="10px" alignItems="center" bgcolor="#262626" borderRadius="10px">
              <Box component="img" src={item.image} alt={item.name} width="50px" height="50px" borderRadius="4px" />
              <Stack direction="row" justifyContent="space-between" flex={1} alignItems="center">
                <Stack spacing="4px">
                  <Typography variant="subtitleSB" color="white">
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="white">
                    {item.desc}
                  </Typography>
                </Stack>
                <ArrowForwardIcon />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Stack spacing="30px" pb="30px" borderBottom="1px solid #383838">
        <Typography
          color="white"
          variant="subtitleMB"
        >
          ZuPass Credentials
        </Typography>
        <Stack padding="10px" borderRadius="10px" bgcolor="#262626">
          <Typography
            color="white"
            variant="subtitleSB"
          >
            No Credentials
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing="30px" pb="30px" borderBottom="1px solid #383838">
        <Typography
          color="white"
          variant="subtitleMB"
        >
          Invited Event Management
        </Typography>
        <Stack direction="row" spacing="14px" padding="10px" alignItems="center" bgcolor="#262626" borderRadius="10px">
          <Box component="img" src="/20.webp" alt="ZuVillage Georgia" width="50px" height="50px" borderRadius="4px" />
          <Stack direction="row" justifyContent="space-between" flex={1} alignItems="center">
            <Stack spacing="4px">
              <Typography variant="subtitleSB" color="white">
                ZuVillage Georgia
              </Typography>
              <Typography variant="caption" color="white">
                You can scan and verify tickets
              </Typography>
            </Stack>
            <ArrowForwardIcon />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
