import { Box, ListItemText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import React from 'react';

interface IProps {
  label: string;
  isChecked: boolean;
}

export default function SelectCheckItem({ isChecked, label }: IProps) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <ListItemText primary={label} />
      <Checkbox checked={isChecked} />
    </Box>
  );
}
