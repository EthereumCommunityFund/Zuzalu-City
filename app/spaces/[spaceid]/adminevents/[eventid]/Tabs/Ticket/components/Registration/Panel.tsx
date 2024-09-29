import React, { useState, useCallback } from 'react';
import { Stack, Typography } from '@mui/material';
import { SettingIcon } from 'components/icons';
import Drawer from '@/components/drawer';
import ConfigForm from './Form';
import { ZuButton } from '@/components/core';

interface PanelProps {
  registered: boolean;
}

const Panel: React.FC<PanelProps> = ({ registered }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  if (!registered)
    return (
      <Stack
        direction="column"
        alignItems="center"
        bgcolor="#2d2d2d"
        padding="20px 10px"
        borderRadius="10px"
        spacing="14px"
        border={registered ? 'none' : '1px solid rgba(125, 255, 209, 0.40)'}
      >
        <SettingIcon color="#6c6c6c" size={7.5} />
        <Stack spacing="10px">
          <Typography
            fontSize="18px"
            fontWeight={700}
            lineHeight={1.2}
            sx={{ opacity: 0.8 }}
          >
            Setup Registration Method
          </Typography>
          <Typography fontSize="13px" lineHeight={1.4} sx={{ opacity: 0.5 }}>
            Setup Initial Pass & Access for this event
          </Typography>
        </Stack>
        <ZuButton
          sx={{
            padding: '6px 10px',
            borderRadius: '10px',
            opacity: 0.7,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: 1.2,
          }}
          onClick={handleOpen}
        >
          Go Setup
        </ZuButton>
        <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
          <ConfigForm onClose={handleClose} />
        </Drawer>
      </Stack>
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
