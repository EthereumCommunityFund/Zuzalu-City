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
    >
      {children}
    </SwipeableDrawer>
  );
};

export default EventDrawer;
