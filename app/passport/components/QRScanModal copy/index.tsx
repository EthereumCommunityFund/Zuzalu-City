import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Typography,
  IconButton,
  Box,
  Modal,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ZuSelect } from 'components/core';
const QrReader = require('react-qr-scanner');

interface IScanQRModal {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  backgroundColor: 'rgba(52, 52, 52, 0.80)',
  border: '2px solid rgba(255, 255, 255, 0.10)',
  padding: '20px',
  boxShadow: 24,
};

const ScanQRModal = ({ showModal, setShowModal }: IScanQRModal) => {
  const [delay, setDelay] = useState(1000);
  const [scanResult, setScanResult] = useState();
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);

  const handleScan = (data: any) => {
    setScanResult(data);
    // setIsSuccess(true)
    setIsFailed(true);
  };

  const handleError = (err: string) => {
    setError(err);
  };

  let verifying = false;

  return (
    <>
      <VerificationSuccess isSuccess={isSuccess} setIsSuccess={setIsSuccess} />
      <VerificationFailed
        isFailed={isFailed}
        setIsFailed={setIsFailed}
        setShowModal={setShowModal}
      />
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={modalStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1.75}
          >
            <Typography variant="h6" color="white">
              Scan Ticket
            </Typography>
            <IconButton
              onClick={() => setShowModal(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {error ? (
            <Typography textAlign="center" color="white">
              Please check your camera accessibility or QR Code
            </Typography>
          ) : (
            <QrReader
              delay={delay}
              style={{
                width: '360px',
                height: '360px',
              }}
              onError={handleError}
              onScan={handleScan}
            />
          )}
          <Typography
            textAlign="center"
            fontWeight={700}
            fontSize="18px"
            color="white"
          >
            {verifying ? 'Verifying...' : 'Scanning...'}
          </Typography>
          <Box mt={2.5} color="white">
            <Typography fontWeight={700}>Select an Event</Typography>
            <ZuSelect />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

interface IVerificationSuccess {
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
}

const VerificationSuccess = ({
  isSuccess,
  setIsSuccess,
}: IVerificationSuccess) => {
  return (
    <Modal open={isSuccess} onClose={() => setIsSuccess(false)}>
      <Box sx={modalStyle}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.75}
        >
          <Typography variant="h6" color="white">
            Scan Ticket
          </Typography>
          <IconButton
            onClick={() => setIsSuccess(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <svg
          width="360"
          height="360"
          viewBox="0 0 360 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="360"
            height="360"
            rx="10"
            fill="#7DFFD1"
            fillOpacity="0.1"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M131.25 180C131.25 153.076 153.076 131.25 180 131.25C206.924 131.25 228.75 153.076 228.75 180C228.75 206.924 206.924 228.75 180 228.75C153.076 228.75 131.25 206.924 131.25 180ZM198.051 170.93C199.255 169.244 198.865 166.902 197.18 165.699C195.494 164.495 193.152 164.885 191.948 166.57L175.771 189.218L167.652 181.098C166.187 179.634 163.813 179.634 162.348 181.098C160.884 182.563 160.884 184.937 162.348 186.402L173.598 197.652C174.378 198.431 175.461 198.828 176.559 198.737C177.658 198.646 178.661 198.077 179.302 197.18L198.051 170.93Z"
            fill="#1BA27A"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M131.25 180C131.25 153.076 153.076 131.25 180 131.25C206.924 131.25 228.75 153.076 228.75 180C228.75 206.924 206.924 228.75 180 228.75C153.076 228.75 131.25 206.924 131.25 180ZM198.051 170.93C199.255 169.244 198.865 166.902 197.18 165.699C195.494 164.495 193.152 164.885 191.948 166.57L175.771 189.218L167.652 181.098C166.187 179.634 163.813 179.634 162.348 181.098C160.884 182.563 160.884 184.937 162.348 186.402L173.598 197.652C174.378 198.431 175.461 198.828 176.559 198.737C177.658 198.646 178.661 198.077 179.302 197.18L198.051 170.93Z"
            fill="url(#paint0_linear_5186_11150)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_5186_11150"
              x1="131.25"
              y1="131.25"
              x2="180"
              y2="228.75"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <Typography
          mt={2.5}
          textAlign="center"
          fontWeight={700}
          fontSize="18px"
          color="#7DFFD1"
        >
          Verified
        </Typography>
      </Box>
    </Modal>
  );
};

interface IVerificationFailed {
  isFailed: boolean;
  setIsFailed: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const VerificationFailed = ({
  isFailed,
  setIsFailed,
  setShowModal,
}: IVerificationFailed) => {
  const handleReScan = () => {
    setShowModal(true);
    setIsFailed(false);
  };
  return (
    <Modal open={isFailed} onClose={() => setIsFailed(false)}>
      <Box sx={modalStyle}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.75}
        >
          <Typography variant="h6" color="white">
            Scan Ticket
          </Typography>
          <IconButton
            onClick={() => setIsFailed(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <svg
          width="360"
          height="360"
          viewBox="0 0 360 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="360"
            height="360"
            rx="10"
            fill="#FF5E5E"
            fillOpacity="0.1"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M180 131.25C153.076 131.25 131.25 153.076 131.25 180C131.25 206.924 153.076 228.75 180 228.75C206.924 228.75 228.75 206.924 228.75 180C228.75 153.076 206.924 131.25 180 131.25ZM171.402 166.098C169.937 164.634 167.563 164.634 166.098 166.098C164.634 167.563 164.634 169.937 166.098 171.402L174.697 180L166.098 188.598C164.634 190.063 164.634 192.437 166.098 193.902C167.563 195.366 169.937 195.366 171.402 193.902L180 185.303L188.598 193.902C190.063 195.366 192.437 195.366 193.902 193.902C195.366 192.437 195.366 190.063 193.902 188.598L185.303 180L193.902 171.402C195.366 169.937 195.366 167.563 193.902 166.098C192.437 164.634 190.063 164.634 188.598 166.098L180 174.697L171.402 166.098Z"
            fill="#FF5E5E"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M180 131.25C153.076 131.25 131.25 153.076 131.25 180C131.25 206.924 153.076 228.75 180 228.75C206.924 228.75 228.75 206.924 228.75 180C228.75 153.076 206.924 131.25 180 131.25ZM171.402 166.098C169.937 164.634 167.563 164.634 166.098 166.098C164.634 167.563 164.634 169.937 166.098 171.402L174.697 180L166.098 188.598C164.634 190.063 164.634 192.437 166.098 193.902C167.563 195.366 169.937 195.366 171.402 193.902L180 185.303L188.598 193.902C190.063 195.366 192.437 195.366 193.902 193.902C195.366 192.437 195.366 190.063 193.902 188.598L185.303 180L193.902 171.402C195.366 169.937 195.366 167.563 193.902 166.098C192.437 164.634 190.063 164.634 188.598 166.098L180 174.697L171.402 166.098Z"
            fill="url(#paint0_linear_5186_11161)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_5186_11161"
              x1="131.25"
              y1="131.25"
              x2="180"
              y2="228.75"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <Typography
          mb={3.5}
          mt={2.5}
          textAlign="center"
          fontWeight={700}
          fontSize="18px"
          color="#FF5E5E"
        >
          Unverified
        </Typography>
        <Button
          onClick={handleReScan}
          fullWidth
          sx={{
            px: 1.75,
            py: 1,
            borderRadius: '10px',
            fontWeight: 600,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
          }}
        >
          Re-Scan
        </Button>
      </Box>
    </Modal>
  );
};

export { ScanQRModal };
