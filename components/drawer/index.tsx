import React from 'react';
import { SwipeableDrawer } from '@mui/material';

interface EventDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
}

const EventDrawer: React.FC<EventDrawerProps> = ({ open, onClose, onOpen, children }) => {
  return (
    <SwipeableDrawer
      hideBackdrop={true}
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      sx={{
        position: 'relative',
        zIndex: 3,
        '& .MuiDrawer-paper': {
          marginTop: '50px',
          height: 'calc(100% - 50px)',
          boxShadow: 'none',
          backgroundColor: 'transparent',
          paddingLeft: '80px', // WARNING:!! Leave space for editorjs to operate, DONT DELETE
        },
      }}
    >
      {children}
    </SwipeableDrawer>
  );
};

export default EventDrawer;