import BpCheckbox from '@/components/event/Checkbox';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

interface IProps {
  checked: boolean;
  title: string;
  desc: string;
  handleChange: () => void;
}

function FormatCheckbox({ checked, title, desc, handleChange }: IProps) {
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

export default function FormatCheckboxGroup({
  checked,
  handleChange,
}: Omit<IProps, 'title' | 'desc'>) {
  return (
    <Box display="flex" justifyContent="space-between" gap="20px">
      <FormatCheckbox
        checked={checked}
        title="In-Person"
        desc="This is a physical event"
        handleChange={handleChange}
      />
      <FormatCheckbox
        checked={!checked}
        title="Online"
        desc="Specially Online Event"
        handleChange={handleChange}
      />
    </Box>
  );
}
