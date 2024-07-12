import { ZuButton } from '@/components/core';
import { Box, ClickAwayListener, Stack, Typography } from '@mui/material';

interface Proptypes {
  text: string;
  showModal: boolean;
  onConfirm: () => void;
}

export default function Modal({ showModal, onConfirm, text }: Proptypes) {
  return showModal ? (
    <Stack
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        position: 'fixed',
        top: '0px',
        left: '0px',
        inset: '0',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(20px)',
        margin: '0px',
      }}
    >
      <ClickAwayListener onClickAway={onConfirm}>
        <Stack
          sx={{
            padding: '20px',
            backgroundColor: '#383838',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            maxWidth: '600px',
          }}
        >
          <Typography fontSize={'20px'} color={'white'}>
            {text}
          </Typography>
          <Box display="flex" justifyContent="flex-end" width="100%">
            <ZuButton onClick={onConfirm}>OK</ZuButton>
          </Box>
        </Stack>
      </ClickAwayListener>
    </Stack>
  ) : (
    <></>
  );
}
