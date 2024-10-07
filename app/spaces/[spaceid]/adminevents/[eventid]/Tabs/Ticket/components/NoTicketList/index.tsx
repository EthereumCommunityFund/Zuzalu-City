import { Stack, Typography } from '@mui/material';
import ConfigForm from '../Registration/Form';
import Drawer from '@/components/drawer';
import useOpenDraw from '@/hooks/useOpenDraw';
import { RegistrationStatus } from '../Status';
import ApplicationPanel from '../Application/Panel';
import { ConfigButton } from '../Common';
import { RegistrationAndAccess } from '@/types';
import useRegAndAccess from '@/hooks/useRegAndAccess';

interface NoTicketListProps {
  regAndAccess?: RegistrationAndAccess;
}

export default function NoTicketList({ regAndAccess }: NoTicketListProps) {
  const { open, handleOpen, handleClose } = useOpenDraw();

  const { registrationAvailable, noApplication } = useRegAndAccess({
    regAndAccess,
  });

  return (
    <>
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        <ConfigForm
          initialStep={2}
          regAndAccess={regAndAccess}
          onClose={handleClose}
        />
      </Drawer>
      <Stack
        spacing="10px"
        p="20px 10px"
        bgcolor="rgba(255, 255, 255, 0.05)"
        sx={{ borderRadius: '10px' }}
        alignItems="center"
      >
        <Typography fontSize={18} fontWeight={700} lineHeight={1.2}>
          This Event has no ticketing
        </Typography>
        <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
          If you want to enable ticketing later, you can click on configure
          ticketing
        </Typography>
        <ConfigButton onClick={handleOpen}>Add Ticketing Method</ConfigButton>
      </Stack>
      <RegistrationStatus
        regAndAccess={regAndAccess}
        isAvailable={registrationAvailable}
      />
      {!noApplication && <ApplicationPanel regAndAccess={regAndAccess} />}
    </>
  );
}
