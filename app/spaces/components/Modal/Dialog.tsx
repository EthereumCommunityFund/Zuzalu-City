import { Button, IconButton } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import MDialog from '@mui/material/Dialog';
import React from 'react';

interface Proptypes {
  title: string;
  message: string;
  showModal: boolean;
  showActions?: boolean;
  actions?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
}

export default function Dialog({
  showModal,
  onConfirm,
  onClose,
  title,
  message,
  actions,
  showActions = true,
}: Proptypes) {
  return (
    <MDialog
      open={showModal}
      onClose={() => onClose?.()}
      PaperProps={{
        style: {
          width: '40%',
          height: 'auto',
          padding: '20px 16px',
          backgroundColor: 'rgba(34, 34, 34, 0.9)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(40px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '20px',
        },
      }}
    >
      <DialogTitle
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
          fontSize: '25px',
          fontWeight: 'bold',
        }}
      >
        {title}
        {onClose ? (
          <IconButton
            onClick={onClose}
            style={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              width: '30px',
              height: '30px',
              borderRadius: '10px',
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent style={{ padding: 0, width: '100%', color: 'white' }}>
        <DialogContentText
          style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        style={{ justifyContent: 'center', width: '100%', padding: 0 }}
      >
        {actions ? (
          actions
        ) : showActions ? (
          <Button onClick={onConfirm} variant="contained" fullWidth>
            Finish
          </Button>
        ) : null}
      </DialogActions>
    </MDialog>
  );
}
