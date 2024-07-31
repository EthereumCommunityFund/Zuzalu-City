import { TimezoneSelectorProps } from '@/types';
import { Autocomplete, TextField } from '@mui/material';
import { allTimezones, useTimezoneSelect } from 'react-timezone-select';

export const TimezoneSelector = ({
  setSelectedTimezone,
  sx,
}: TimezoneSelectorProps) => {
  const { options } = useTimezoneSelect({ timezones: allTimezones });

  return (
    <Autocomplete
      disablePortal
      options={options}
      sx={{ ...sx }}
      renderInput={(params) => <TextField {...params} />}
      onChange={(e, val) => val && setSelectedTimezone(val)}
    />
  );
};
