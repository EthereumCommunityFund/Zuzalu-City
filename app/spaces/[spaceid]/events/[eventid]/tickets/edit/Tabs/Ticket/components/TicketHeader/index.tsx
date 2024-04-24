import * as React from 'react';
import { Typography, Stack } from '@mui/material';
import { ZuSwitch } from 'components/core';

const TicketHeader = () => {
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" color="white">
          Ticketing
        </Typography>
        <Typography variant="body2" color="white">
          Total Sold: 18
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        padding={1}
        borderRadius={2}
        width="50%"
        sx={{
          background: isChecked
            ? 'linear-gradient(117deg, #354d44 0%, #2d2d2d 100%)'
            : '#2d2d2d',
        }}
      >
        <ZuSwitch
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
        />
        <Stack direction="column">
          <Typography variant="subtitle2" color="white">
            Applications
          </Typography>
          <Typography variant="body2" color="white">
            Open
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TicketHeader;
