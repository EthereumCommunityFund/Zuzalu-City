import React from 'react';
import { Box, SwipeableDrawer, useTheme } from '@mui/material';

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
  const breakpoints = useTheme().breakpoints;
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
      <Box
        sx={{
          width: '700px',
          [breakpoints.down('sm')]: {
            width: '100vw',
            borderLeft: 'none',
          },
        }}
        role="presentation"
        zIndex="100"
        borderLeft="1px solid #383838"
      >
        {children}
      </Box>
    </SwipeableDrawer>
  );
};

export default EventDrawer;
