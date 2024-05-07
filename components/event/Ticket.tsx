import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import BpCheckbox from './Checkbox';

const Ticket = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <Stack
      padding="10px"
      direction="row"
      spacing="10px"
      borderRadius="10px"
      bgcolor={checked ? '#393a38' : '#2a2a2a'}
    >
      <BpCheckbox
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
      />
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography color="white" variant="bodyMB">
              TicketName
            </Typography>
            <Typography color="white" variant="caption">
              LABEL IF/A
            </Typography>
          </Stack>
          <Typography color="white" variant="bodyMB">
            $00.00
          </Typography>
        </Stack>
        <Typography color="white" variant="bodyS">
          one two three four five six seven eight nine
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Ticket;
