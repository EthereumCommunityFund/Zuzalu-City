import { ZuButton } from '@/components/core';
import { PlusCircleIcon, XMarkIcon } from '@/components/icons';
import { Box } from '@mui/material';
import React from 'react';
import { useMediaQuery } from '@/hooks';

interface IProps {
  confirmText: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

export default function FormFooter({
  confirmText,
  handleClose,
  handleConfirm,
}: IProps) {
  const { isMobile } = useMediaQuery();
  return (
    <Box display="flex" gap="20px" flexDirection={isMobile ? 'column' : 'row'}>
      <ZuButton
        sx={{
          flex: 1,
          width: isMobile ? '100%' : 'auto',
        }}
        startIcon={<XMarkIcon />}
        onClick={handleClose}
      >
        Discard
      </ZuButton>
      <ZuButton
        sx={{
          color: '#67DBFF',
          backgroundColor: 'rgba(103, 219, 255, 0.10)',
          flex: 1,
          width: isMobile ? '100%' : 'auto',
        }}
        startIcon={<PlusCircleIcon color="#67DBFF" />}
        onClick={handleConfirm}
      >
        {confirmText}
      </ZuButton>
    </Box>
  );
}
