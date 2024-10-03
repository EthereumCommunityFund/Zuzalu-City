import React from 'react';
import { Stack, Typography } from '@mui/material';
import { SettingIcon } from 'components/icons';
import Drawer from '@/components/drawer';
import ConfigForm from './Form';
import { ZuButton } from '@/components/core';
import useOpenDraw from '@/hooks/useOpenDraw';
import { ConfigPanel } from '../Common';

interface PanelProps {
  registered: boolean;
}

const Panel: React.FC<PanelProps> = ({ registered }) => {
  const { open, handleOpen, handleClose } = useOpenDraw();

  if (!registered)
    return (
      <>
        <ConfigPanel
          title="Setup Registration Method"
          desc="Setup Initial Pass & Access for this event"
          isGreenBorder
          handleOpen={handleOpen}
        />
        <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
          <ConfigForm onClose={handleClose} />
        </Drawer>
      </>
    );

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

export default Panel;
