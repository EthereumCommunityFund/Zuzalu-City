import { TimezoneSelectorProps } from '@/types';
import { Autocomplete, TextField } from '@mui/material';
import { allTimezones, useTimezoneSelect } from 'react-timezone-select';

export const TimezoneSelector = ({
  setSelectedTimezone,
  sx,
  defaultValue,
}: TimezoneSelectorProps) => {
  const { options } = useTimezoneSelect({ timezones: allTimezones });

  return (
    <Autocomplete
      defaultValue={options.find((item) => item.value === defaultValue)}
      disablePortal
      options={options}
      sx={{ ...sx }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => <TextField {...params} />}
      onChange={(e, val) => val && setSelectedTimezone(val)}
    />
  );
};
