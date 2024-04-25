'use client';

import * as React from 'react';
import {
  Select,
  Input,
  MenuItem,
  styled,
  SelectChangeEvent,
} from '@mui/material';
import { BoltIcon } from 'components/icons';

interface ZuInputProps {
  startAdornment?: React.ReactNode; // Optional icon component
}

const ZuInput = styled(Input)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#383838',
  '& .MuiSelect-select': {
    paddingLeft: theme.spacing(2), // Adjust padding based on icon size
  },
  color: 'white',
  padding: '6px 12px',
  borderRadius: '10px',
})) as React.FC<ZuInputProps>;

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
];
const ZuSelect = () => {
  const [value, setValue] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      input={<ZuInput startAdornment={<BoltIcon />} />} // Replace YourIcon with your desired icon component
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ZuSelect;
