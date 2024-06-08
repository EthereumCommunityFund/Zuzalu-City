'use client';
import React, { useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { LeftArrowIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import { useRouter } from 'next/navigation';
import { ScanQRModal } from '../../components/QRScanModal copy';

const Home = () => {
  const router = useRouter();

  const [isScanVerify, setIsScanVerify] = useState<boolean>(false);

  return (
    <Stack
      justifyContent={'center'}
      spacing="20px"
      padding="30px"
      sx={{ margin: '0 auto' }}
      maxWidth="640px"
    >
      <Stack direction="row" spacing="20px" alignItems="center">
        <ZuButton startIcon={<LeftArrowIcon />} onClick={() => router.back()}>
          Back
        </ZuButton>
        <Typography variant="subtitleLB" color="white">
          Scan QR Code
        </Typography>
      </Stack>

      <ScanQRModal setShowModal={setIsScanVerify} showModal={isScanVerify} />
      <Typography variant="bodyMB" color="white">
        Action (beta only has one action):
      </Typography>
      <Stack
        onClick={() => setIsScanVerify(true)}
        sx={{ cursor: 'pointer' }}
        padding="10px"
        borderRadius="10px"
        bgcolor="#2d2d2d"
        border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
      >
        <Typography variant="subtitleSB" color="white">
          Verify
        </Typography>
        <Typography variant="caption" color="white">
          Scan & verify a ticket
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Home;
