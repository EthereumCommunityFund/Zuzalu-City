'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Typography, useTheme } from '@mui/material';
import { ZuButton } from 'components/core';
import { PlusIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';

const EventHeader = () => {
  // const [showModal, setShowModal] = React.useState(false);
  const theme = useTheme();
  // const router = useRouter();
  const { isAuthenticated } = useCeramicContext();

  const createButtonHandler = () => {
    // if(isAuthenticated) {
    //   // router.push('/spaces/create')
    // } else {
    // }
  };

  return (
    <Stack
      padding="40px 25px"
      direction="column"
      spacing={2}
      borderBottom="1px solid #383838"
    >
      <Typography color={theme.palette.text.primary} variant="h1">
        Events
      </Typography>
      <Typography color={theme.palette.text.primary} variant="bodyBB">
        Welcome to the new Zuzalu City
      </Typography>
      <ZuButton startIcon={<PlusIcon />} onClick={createButtonHandler}>
        Create a Event
      </ZuButton>
    </Stack>
  );
};

export default EventHeader;
