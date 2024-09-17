import { ZuButton } from '@/components/core';
import { XMarkIcon } from '@/components/icons';
import { Box, Typography } from '@mui/material';
import React from 'react';

interface IProps {
  title: string;
  handleClose: () => void;
}

export default function FormHeader({ handleClose, title }: IProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      height="50px"
      borderBottom="1px solid #383838"
      paddingX={3}
      gap={2}
    >
      <ZuButton
        startIcon={<XMarkIcon />}
        onClick={handleClose}
        sx={{
          backgroundColor: 'transparent',
        }}
      >
        Close
      </ZuButton>
      <Typography variant="subtitleSB">{title}</Typography>
    </Box>
  );
}
