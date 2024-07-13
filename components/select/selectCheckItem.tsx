import { Box, ListItemText, MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import React from 'react';

interface IProps {
  value: string;
  label: string;
  isChecked: boolean;
}

export default function SelectCheckItem({ value, isChecked, label }: IProps) {
  return (
    <MenuItem value={value}>
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
    </MenuItem>
  );
}
