import React, { useState, useCallback } from 'react';
import { Stack, Typography } from '@mui/material';
import { SettingIcon } from 'components/icons';
import Drawer from '@/components/drawer';
import ConfigForm from './ConfigForm';

interface TicketAddProps {}

const ConfigPanel: React.FC<TicketAddProps> = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <Stack direction="column">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
      >
        <Typography variant="h6" color="white">
          Event Ticketing
        </Typography>
      </Stack>
      <Typography
        mt="10px"
        variant="buttonM"
        color="white"
        sx={{ opacity: 0.8 }}
      >
        Configure registration and access to this event&apos;s schedule
      </Typography>
      <Stack
        direction="column"
        alignItems="center"
        bgcolor="#2d2d2d"
        padding="20px 10px"
        borderRadius="10px"
        spacing="10px"
        mt="20px"
        sx={{ cursor: 'pointer' }}
        onClick={handleOpen}
      >
        <SettingIcon color="#6c6c6c" size={7.5} />
        <Typography variant="subtitleSB" color="white" sx={{ opacity: 0.8 }}>
          Configure Pass
        </Typography>
        <Typography variant="body2" color="white" sx={{ opacity: 0.5 }}>
          Setup Initial Pass & Access for this event
        </Typography>
      </Stack>
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        <ConfigForm onClose={handleClose} />
      </Drawer>
    </Stack>
  );
};

export default ConfigPanel;
