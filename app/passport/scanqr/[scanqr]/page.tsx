'use client';
import * as React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { LeftArrowIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import { useRouter } from 'next/navigation';
import { ScanQRModal } from '../../components/QRScanModal copy';

const Home = () => {
  const router = useRouter();

  const [isScanVerify, setIsScanVerify] = React.useState<boolean>(false);

  return (
    <Stack direction="row">
      <Stack direction="column" flex={1}>
        <Box
          display="flex"
          justifyContent={'center'}
          flexDirection={'column'}
          gap="15px"
          padding={'30px'}
          sx={{ margin: '0 auto' }}
          maxWidth={'700px'}
          width={'100%'}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <ZuButton
              sx={{ backgroundColor: '#333333', marginRight: '20px' }}
              startIcon={<LeftArrowIcon />}
              onClick={() => router.back()}
            >
              Back
            </ZuButton>
            <Typography
              variant="h6"
              fontSize={'24px'}
              fontWeight={'700'}
              color="white"
              marginLeft={'10px'}
              lineHeight="40px"
            >
              Scan QR Code
            </Typography>
          </Stack>

          <ScanQRModal
            setShowModal={setIsScanVerify}
            showModal={isScanVerify}
          />

          <div className="text-white my-5 text-[14px] font-[600] leading-[160%]">
            Action (beta only has one action):
          </div>

          <div
            onClick={() => setIsScanVerify(true)}
            className="p-[10px] rounded-[10px] bg-[rgba(255,255,255,0.05)] cursor-pointer"
          >
            <div className="mb-[4px] text-white text-[18px] leading-[120%] font-[700]">
              Verify
            </div>
            <div className="text-[10px] leading-[120%] text-[rgba(255,255,255,0.7)]">
              Scan & verify a ticket
            </div>
          </div>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Home;
