import * as React from 'react';
import { Stack, Box, SwipeableDrawer, Typography } from '@mui/material';
import {
  TicketHeader,
  TicketList,
  TicketAdd,
  TicketAccess,
  InitialSetup,
  TicketSetup,
  CreateTicket,
  TicketCreationSummary,
  ProcessingTicket,
  TicketVault,
} from './components';
import { ZuButton } from 'components/core';
import { XMarkIcon } from '@/components/icons';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Ticket = () => {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const [isConfirm, setIsConfirm] = React.useState(false);
  const [isNext, setIsNext] = React.useState(false);
  const [goToSummary, setGoToSummary] = React.useState(false);
  const [purchasingTicket, setPurchasingTicket] = React.useState(false);
  const [toggleAction, setToggleAction] = React.useState('CreateTicket');

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        maxWidth: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
        backgroundColor: '#222222',
      }}
      role="presentation"
      zIndex="100"
      borderLeft="1px solid #383838"
    >
      <Box
        display="flex"
        alignItems="center"
        height="50px"
        borderBottom="1px solid #383838"
        paddingX={3}
      >
        <ZuButton onClick={() => toggleDrawer('right', false)}>Close</ZuButton>
        <Typography marginLeft={'14px'} fontSize="18px" fontWeight="bold">
          Create Ticket
        </Typography>
      </Box>

      {!goToSummary && !isConfirm && !purchasingTicket && !isNext && (
        <InitialSetup setIsNext={setIsNext} />
      )}
      {!goToSummary && !isConfirm && !purchasingTicket && isNext && (
        <TicketSetup setIsNext={setIsNext} setIsConfirm={setIsConfirm} />
      )}
      {isConfirm && !purchasingTicket && !goToSummary && !isNext && (
        <CreateTicket
          setIsConfirm={setIsConfirm}
          setGoToSummary={setGoToSummary}
        />
      )}
      {!purchasingTicket && !isConfirm && goToSummary && !isNext && (
        <TicketCreationSummary
          setIsConfirm={setIsConfirm}
          setPurchasingTicket={setPurchasingTicket}
          setGoToSummary={setGoToSummary}
        />
      )}
      {purchasingTicket && !goToSummary && !isConfirm && !isNext && (
        <ProcessingTicket
          setPurchasingTicket={setPurchasingTicket}
          toggleDrawer={toggleDrawer}
        />
      )}
    </Box>
  );
  const vault = (anchor: Anchor) => (
    <Box
      bgcolor="#222222"
      width="700px"
      role="presentation"
      zIndex="100"
      borderLeft="1px solid #383838"
    >
      <Box
        display="flex"
        alignItems="center"
        height="50px"
        borderBottom="1px solid #383838"
        paddingX={3}
      >
        <ZuButton
          onClick={() => toggleDrawer('right', false)}
          startIcon={<XMarkIcon />}
        >
          Close
        </ZuButton>
        <Typography marginLeft={'14px'} fontSize="18px" fontWeight="bold">
          View Ticket
        </Typography>
      </Box>
      <TicketVault />
    </Box>
  );

  return (
    <Stack spacing={2}>
      <TicketHeader />
      <TicketList setToggleAction={setToggleAction} onToggle={toggleDrawer} />
      <TicketAdd />
      <TicketAccess />
      <SwipeableDrawer
        hideBackdrop={true}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: '50px',
            height: 'calc(100% - 50px)',
            boxShadow: 'none',
          },
        }}
        anchor="right"
        open={state['right']}
        onClose={() => toggleDrawer('right', false)}
        onOpen={() => toggleDrawer('right', true)}
      >
        {toggleAction === 'CreateTicket'
          ? list('right')
          : toggleAction === 'ViewVault'
            ? vault('right')
            : null}
      </SwipeableDrawer>
    </Stack>
  );
};

export default Ticket;
