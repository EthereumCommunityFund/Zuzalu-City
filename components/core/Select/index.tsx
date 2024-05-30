'use client';

import * as React from 'react';
import {
  Select,
  Input,
  MenuItem,
  styled,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';

interface ZuInputProps {
  startAdornment?: React.ReactNode; // Optional icon component
  options?: {
    value: string,
    label: string
  }[]
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

const ZuSelect = ({ icon, options, sx }: {
  icon?: React.ReactNode, 
  options?: {
    value: string,
    label: string
  }[],
  sx?: SxProps
}) => {
  const [value, setValue] = React.useState(options ? options[0].value : '');

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <Select
      sx={{...sx}}
      value={value}
      onChange={handleChange}
      MenuProps={{
        PaperProps: {
          style: {
            backgroundColor: '#222222'
          }
        }
      }}
      input={icon ? <ZuInput startAdornment={icon} /> : <></>} // Replace YourIcon with your desired icon component
    >
      {options && options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            '&:hover': {
              backgroundColor: '#333333'
            }
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ZuSelect;
