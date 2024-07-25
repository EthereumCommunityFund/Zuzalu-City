'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Typography, useTheme } from '@mui/material';
import { ZuButton } from 'components/core';
import { SpacePlusIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import Dialog from '../Modal/Dialog';
import { chainID, isDev } from '@/constant';

const SpaceHeader = () => {
  const [showModal, setShowModal] = React.useState(false);
  const theme = useTheme();
  const router = useRouter();
  const { ceramic, isAuthenticated } = useCeramicContext();

  const createButtonHandler = () => {
    if (isAuthenticated) {
      router.push('/spaces/create');
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  return (
    <Stack
      padding="40px 25px"
      direction="column"
      spacing={2}
      borderBottom="1px solid #383838"
    >
      <Typography color={theme.palette.text.primary} variant="h1">
        Spaces
      </Typography>
      <Typography color={theme.palette.text.primary} variant="bodyBB">
        Welcome to the new Zuzalu City
      </Typography>
      {(isDev ||
        ceramic.did?.parent.toString().trim().toLowerCase() ===
          `did:pkh:eip155:${chainID.toString()}:0x9bc15fcfd4691fde75bb900d2bc62462c868f125` ||
        ceramic.did?.parent.toString().trim().toLowerCase() ===
          `did:pkh:eip155:${chainID.toString()}:0x379e27606208521286e35c1122e3823d0112701f`) && (
        <ZuButton startIcon={<SpacePlusIcon />} onClick={createButtonHandler}>
          Create a Space
        </ZuButton>
      )}
      <Dialog
        title="Warning"
        message="Login to Create a Space"
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
      />
    </Stack>
  );
};

export default SpaceHeader;
