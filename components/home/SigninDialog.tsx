import Dialog from '@/app/spaces/components/Modal/Dialog';
import CheckinConnectButton from '@/components/checkin/CheckinConnectButton';
import { ZuButton } from '@/components/core';
import { ZuPassIcon } from '@/components/icons/ZuPassIcon';
import { useZupassContext } from '@/context/ZupassContext';
import { Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

interface IProps {
  stage: string;
  open: boolean;
  setStage: (stage: string) => void;
  handleClose: () => void;
  handleShowNewUserModal: () => void;
}

export default function SigninDialog({
  stage,
  open,
  handleClose,
  handleShowNewUserModal,
  setStage,
}: IProps) {
  const { auth, nullifierHash } = useZupassContext();
  const handleZupass = () => {
    if (!nullifierHash) {
      auth();
    } else {
      setStage('Wallet Link');
    }
  };

  const modelContent = useMemo(() => {
    if (stage === 'Wallet Link') {
      return (
        <Stack
          padding="14px 20px 20px 20px"
          width="100%"
          gap="18px"
          height={'350px'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <CheckinConnectButton handleConfirm={handleShowNewUserModal} />
        </Stack>
      );
    }
    return (
      <Stack gap={'14px'} alignItems={'center'} width={'100%'}>
        <Typography variant="bodyM">Check-in with your pass</Typography>
        <ZuButton
          startIcon={<ZuPassIcon />}
          sx={{
            width: '100%',
          }}
          onClick={handleZupass}
        >
          ZuPass
        </ZuButton>
      </Stack>
    );
  }, [handleShowNewUserModal, handleZupass, stage]);

  return (
    <Dialog
      showActions={false}
      showModal={open}
      title="Check-in"
      onClose={handleClose}
      message={modelContent}
    />
  );
}
