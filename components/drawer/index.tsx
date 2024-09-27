import React from 'react';
import { SwipeableDrawer } from '@mui/material';

interface EventDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
}

const EventDrawer: React.FC<EventDrawerProps> = ({
  open,
  onClose,
  onOpen,
  children,
}) => {
  return (
    <SwipeableDrawer
      hideBackdrop={true}
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      sx={{
        '& .MuiDrawer-paper': {
          background: '#222',
          borderLeft: '1px solid #383838',
        },
      }}
    >
      {children}
    </SwipeableDrawer>
  );
};

export default EventDrawer;
