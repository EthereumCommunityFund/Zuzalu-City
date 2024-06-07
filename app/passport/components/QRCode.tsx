import React, { Dispatch, SetStateAction, useState } from 'react';
import { ZuSwitch } from '@/components/core';
import { ArrowPathIcon, CloseIcon, InformationIcon, LeftArrowIcon } from '@/components/icons';
import { useQRCode } from 'next-qrcode';
import { Stack, Typography } from '@mui/material';

interface PropTypes {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const QRCode = () => {
  const { Canvas } = useQRCode();

  const [isZk, setIsZk] = useState<boolean>(false);
  const [errorCorrectionLevel, setErrorCorrectionLevel] =
    useState<string>('M');
  const [isRotated, setIsRotated] = useState<boolean>(false);

  const getRandomErrorCorrectionLevel = () => {
    const levels = ['L', 'M', 'Q', 'H'];
    let clevel = levels[Math.floor(Math.random() * levels.length)];

    setIsRotated(true);
    setErrorCorrectionLevel(clevel);
    setTimeout(() => setIsRotated(false), 500);
  };

  return (
    <Stack width="360px" padding="20px" borderRadius="10px" spacing="14px"
      border="2px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
      sx={{
        position: 'absolute',
        background: "rgba(52, 52, 52, 0.80)",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
      <Stack direction="row" alignItems="center">
        <Stack padding="10px" bgcolor="#414141" borderRadius="10px" color="white">
          <LeftArrowIcon size={5} />
        </Stack>
        <Typography color="white" variant="subtitleSB" flex="1" textAlign="center">
          QR Code
        </Typography>
        <Stack padding="10px" bgcolor="#414141" borderRadius="10px" color="white">
          <CloseIcon size={5} />
        </Stack>
      </Stack>
      <Stack alignItems="center">
        <Canvas
          text={'https://github.com/aagbotemi/'}
          options={{
            errorCorrectionLevel: errorCorrectionLevel,
            margin: 3,
            scale: 4,
            width: 300,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          }}
        />
      </Stack>
      <Stack alignItems="center">
        <Stack
          onClick={() => getRandomErrorCorrectionLevel()}
          sx={{ cursor: "pointer" }}
          padding="10px" bgcolor="#3f3f3f" borderRadius="10px" width="fit-content">
          <ArrowPathIcon />
        </Stack>
      </Stack>
      <Stack spacing="14px">
        <Stack spacing="10px">
          <Typography variant="subtitleSB" color="white" textAlign="center">
            {isZk ? '*%_||*(' : 'Username'}
          </Typography>
          <Typography variant="bodyS" color="white" textAlign="center">
            {isZk ? '**&^|*@' : 'username@gmail.com'}
          </Typography>
        </Stack>
        <Stack
          sx={{ background: isZk ? "linear-gradient(90deg, rgba(125, 255, 209, 0.16) 0%, rgba(125, 255, 209, 0.00) 100%), var(--Inactive-White, rgba(255, 255, 255, 0.05))" : "#3c3c3c" }}
          direction="row" padding="10px" borderRadius="10px" alignItems="center">
          <Stack direction="row" spacing="14px" flex="1" alignItems="center">
            <ZuSwitch onClick={() => setIsZk(!isZk)} />
            <Typography variant="bodyBB" color="white">
              Zero-Knowledge Mode
            </Typography>
          </Stack>
          <InformationIcon />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default QRCode;
