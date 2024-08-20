import BpCheckbox from '@/components/event/Checkbox';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

interface IProps {
  checked: boolean;
  title: string;
  desc: string;
  handleChange: () => void;
}

export default function SessionFormatCheckbox({
  checked,
  title,
  desc,
  handleChange,
}: IProps) {
  return (
    <Box
      bgcolor={checked ? '#484E45' : '#373737'}
      borderRadius="10px"
      padding="10px"
      display="flex"
      alignItems="center"
      gap="10px"
      flex={1}
      onClick={handleChange}
    >
      <BpCheckbox checked={checked} />
      <Stack>
        <Typography
          color="white"
          fontSize="16px"
          fontWeight={600}
          fontFamily="Inter"
        >
          {title}
        </Typography>
        <Typography color="white" fontSize="10px" fontFamily="Inter">
          {desc}
        </Typography>
      </Stack>
    </Box>
  );
}
