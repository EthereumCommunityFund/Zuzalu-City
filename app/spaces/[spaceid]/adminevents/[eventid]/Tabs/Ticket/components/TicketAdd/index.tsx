import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import ZuButton from 'components/core/Button';
import { PlusIcon, PlusCircleIcon } from 'components/icons';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface TicketAddProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
  setToggleAction: React.Dispatch<React.SetStateAction<string>>;
  visible?: boolean;
}

const TicketAdd: React.FC<TicketAddProps> = ({
  onToggle = (anchor: Anchor, open: boolean) => {},
  setToggleAction,
  visible = false,
}) => {
  return (
    <Stack direction="column" spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
      >
        <Typography variant="h6" color="white">
          Event Tickets
        </Typography>
        {visible ? (
          <ZuButton
            startIcon={<PlusIcon />}
            onClick={() => {
              onToggle('right', true);
              setToggleAction('CreateTicket');
            }}
          >
            New Ticket
          </ZuButton>
        ) : null}
      </Stack>
      <Typography mt={0} variant="body2" color="white">
        These are tickets for this event
      </Typography>
      <Stack
        direction="column"
        alignItems="center"
        bgcolor="#2d2d2d"
        padding="20px 10px"
        borderRadius={2}
      >
        <PlusCircleIcon color="#6c6c6c" size={15} />
        <Typography variant="subtitle2" color="white">
          No Tickets
        </Typography>
        <Typography variant="body2" color="white">
          Create a ticket
        </Typography>
      </Stack>
    </Stack>
  );
};

export default TicketAdd;
