import { ZuButton } from '@/components/core';
import { ClickAwayListener, Stack, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface Proptypes {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function WarningModal({ showModal, setShowModal }: Proptypes) {
  return showModal ? (
    <Stack
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        position: 'absolute',
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
      <ClickAwayListener onClickAway={() => setShowModal(false)}>
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
          }}
        >
          <Typography fontSize={'20px'} color={'white'}>
            Please do Login to Create Space.
          </Typography>
          <ZuButton onClick={() => setShowModal(false)}>OK</ZuButton>
        </Stack>
      </ClickAwayListener>
    </Stack>
  ) : (
    <></>
  );
}
