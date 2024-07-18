import React, { useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Anchor } from '@/types';
import { InitialStep } from './steps/InitialStep';
import { FirstStep } from './steps/FirstStep';

interface EventRegisterProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
  setWhitelist?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setSponsor?: React.Dispatch<React.SetStateAction<boolean>> | any;
  external_url?: string;
}

const EventRegister: React.FC<EventRegisterProps> = ({
  onToggle,
  setWhitelist,
  setSponsor,
  external_url,
}) => {
  const [isOne, setIsOne] = useState<boolean>(false);
  const [isTwo, setIsTwo] = useState<boolean>(false);
  const handleClick = () => {
    window.open(external_url, '_blank');
  };
  const [currentStep, setCurrentStep] = useState<number>(0);
  const handleRegisterAsSponsor = () => {
    setSponsor(true);
    setWhitelist(false);
    onToggle('right', true);
  };

  const handleStep = (val: number) => {
    setCurrentStep(val);
  };

  return (
    <Stack
      borderRadius="10px"
      spacing={1}
      border="1px solid #383838"
      bgcolor="#262626"
    >
      <Stack
        padding="10px 14px"
        borderBottom="1px solid #383838"
        bgcolor="#2d2d2d"
        borderRadius="10px 10px 0 0"
      >
        <Typography color="white" variant="subtitleS">
          Event Registration
        </Typography>
        <Box display={'flex'} gap={'10px'} alignItems={'center'}>
          <Typography
            textTransform={'uppercase'}
            fontSize={'10px'}
            sx={{ opacity: '0.6' }}
          >
            Ticketing PROTOCOL:
          </Typography>
          <Box
            display={'flex'}
            gap={'4px'}
            flexDirection={'row'}
            alignItems={'center'}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_7509_7477)">
                <path
                  fillRule="evenodd"
                  clip-rule="evenodd"
                  d="M0.000793457 2.80426C0.000793457 2.20673 0.486815 1.7207 1.08435 1.7207C1.68189 1.7207 2.16791 2.20673 2.16791 2.80426V4.6102H0.36198C0.162425 4.6102 0.000793457 4.44857 0.000793457 4.24901V2.80426ZM5.77978 9.66681V11.0341C5.77978 11.754 5.28812 12.4209 4.57771 12.5364C3.67248 12.6838 2.89029 11.989 2.89029 11.1116V2.80426C2.89029 2.39612 2.74897 2.02342 2.51985 1.7207H10.114C11.3091 1.7207 12.2811 2.69275 12.2811 3.88782V9.66681H5.77978ZM6.50215 11.1116V10.3892H14.0871C14.2866 10.3892 14.4483 10.5508 14.4483 10.7504C14.4483 12.1468 13.3164 13.2787 11.92 13.2787H4.33503C5.53011 13.2787 6.50215 12.3064 6.50215 11.1116ZM5.18211 3.897C5.18211 3.60833 5.41612 3.37432 5.70479 3.37432H6.75014C7.03881 3.37432 7.27282 3.60833 7.27282 3.897V4.94236C7.27282 5.23103 7.03881 5.46504 6.75014 5.46504H5.70479C5.41612 5.46504 5.18211 5.23103 5.18211 4.94236V3.897ZM5.70479 3.82233C5.66355 3.82233 5.63012 3.85576 5.63012 3.897V4.94236C5.63012 4.9836 5.66355 5.01703 5.70479 5.01703H6.75014C6.79138 5.01703 6.82481 4.9836 6.82481 4.94236V3.897C6.82481 3.85576 6.79138 3.82233 6.75014 3.82233H5.70479ZM5.18211 6.58457C5.18211 6.29591 5.41612 6.06189 5.70479 6.06189H6.75014C7.03881 6.06189 7.27282 6.29591 7.27282 6.58457V7.62993C7.27282 7.9186 7.03881 8.15261 6.75014 8.15261H5.70479C5.41612 8.15261 5.18211 7.9186 5.18211 7.62993V6.58457ZM5.70479 6.5099C5.66355 6.5099 5.63012 6.54333 5.63012 6.58457V7.62993C5.63012 7.67117 5.66355 7.7046 5.70479 7.7046H6.75014C6.79138 7.7046 6.82481 7.67117 6.82481 7.62993V6.58457C6.82481 6.54333 6.79138 6.5099 6.75014 6.5099H5.70479ZM8.39285 3.37432C8.10418 3.37432 7.87017 3.60833 7.87017 3.897V4.94236C7.87017 5.23103 8.10418 5.46504 8.39285 5.46504H9.43821C9.72687 5.46504 9.96089 5.23103 9.96089 4.94236V3.897C9.96089 3.60833 9.72687 3.37432 9.43821 3.37432H8.39285ZM8.31818 3.897C8.31818 3.85576 8.35161 3.82233 8.39285 3.82233H9.43821C9.47944 3.82233 9.51287 3.85576 9.51287 3.897V4.94236C9.51287 4.9836 9.47944 5.01703 9.43821 5.01703H8.39285C8.35161 5.01703 8.31818 4.9836 8.31818 4.94236V3.897ZM5.92589 4.41949C5.92589 4.25454 6.05961 4.12082 6.22456 4.12082H6.22755C6.3925 4.12082 6.52622 4.25454 6.52622 4.41949V4.42248C6.52622 4.58743 6.3925 4.72116 6.22755 4.72116H6.22456C6.05961 4.72116 5.92589 4.58743 5.92589 4.42248V4.41949ZM8.61395 4.41949C8.61395 4.25454 8.74767 4.12082 8.91263 4.12082H8.91561C9.08056 4.12082 9.21428 4.25454 9.21428 4.41949V4.42248C9.21428 4.58743 9.08056 4.72116 8.91561 4.72116H8.91263C8.74767 4.72116 8.61395 4.58743 8.61395 4.42248V4.41949ZM5.92589 7.10756C5.92589 6.94261 6.05961 6.80888 6.22456 6.80888H6.22755C6.3925 6.80888 6.52622 6.94261 6.52622 7.10756V7.11054C6.52622 7.2755 6.3925 7.40922 6.22755 7.40922H6.22456C6.05961 7.40922 5.92589 7.2755 5.92589 7.11054V7.10756ZM8.61395 7.10756C8.61395 6.94261 8.74767 6.80888 8.91263 6.80888H8.91561C9.08056 6.80888 9.21428 6.94261 9.21428 7.10756V7.11054C9.21428 7.2755 9.08056 7.40922 8.91561 7.40922H8.91263C8.74767 7.40922 8.61395 7.2755 8.61395 7.11054V7.10756ZM8.16591 6.06189C8.00095 6.06189 7.86723 6.19562 7.86723 6.36057V6.36355C7.86723 6.52851 8.00095 6.66223 8.16591 6.66223H8.16889C8.33385 6.66223 8.46757 6.52851 8.46757 6.36355V6.36057C8.46757 6.19562 8.33385 6.06189 8.16889 6.06189H8.16591ZM9.36061 6.36057C9.36061 6.19562 9.49433 6.06189 9.65929 6.06189H9.66227C9.82723 6.06189 9.96095 6.19562 9.96095 6.36057V6.36355C9.96095 6.52851 9.82723 6.66223 9.66227 6.66223H9.65929C9.49433 6.66223 9.36061 6.52851 9.36061 6.36355V6.36057ZM9.65929 7.55576C9.49433 7.55576 9.36061 7.68948 9.36061 7.85444V7.85742C9.36061 8.02238 9.49433 8.1561 9.65929 8.1561H9.66227C9.82723 8.1561 9.96095 8.02238 9.96095 7.85742V7.85444C9.96095 7.68948 9.82723 7.55576 9.66227 7.55576H9.65929ZM7.86723 7.85444C7.86723 7.68948 8.00095 7.55576 8.16591 7.55576H8.16889C8.33385 7.55576 8.46757 7.68948 8.46757 7.85444V7.85742C8.46757 8.02238 8.33385 8.1561 8.16889 8.1561H8.16591C8.00095 8.1561 7.86723 8.02238 7.86723 7.85742V7.85444Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_7509_7477">
                  <rect
                    width="14.4475"
                    height="14.4475"
                    fill="white"
                    transform="translate(0 0.276367)"
                  />
                </clipPath>
              </defs>
            </svg>
            <Typography fontSize={'14.477px'} fontFamily={'Cutive Mono'}>
              Scrollpass
            </Typography>
          </Box>
        </Box>
      </Stack>
      {currentStep === 0 && (
        <InitialStep
          handleStep={handleStep}
          isOne={isOne}
          isTwo={isTwo}
          setIsOne={setIsOne}
          setIsTwo={setIsTwo}
          onToggle={onToggle}
          setSponsor={setSponsor}
          setWhitelist={setWhitelist}
        />
      )}
      {currentStep === 1 && (
        <FirstStep
          handleStep={handleStep}
          handleRegisterAsSponsor={handleRegisterAsSponsor}
        />
      )}
    </Stack>
  );
};

export default EventRegister;
