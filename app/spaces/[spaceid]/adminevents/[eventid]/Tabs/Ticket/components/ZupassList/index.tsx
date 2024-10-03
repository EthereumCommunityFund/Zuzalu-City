import { Stack } from '@mui/material';
import { ConfigPanel, TitleWithTag } from '../Common';
import { RegistrationStatus } from '../Status';
import ApplicationPanel from '../Application/Panel';
import AccessRules from '../AccessRules';
import useOpenDraw from '@/hooks/useOpenDraw';
import Drawer from '@/components/drawer';
import Form from './Form';

export default function ZupassList() {
  const { open, handleOpen, handleClose } = useOpenDraw();
  return (
    <>
      <Stack spacing="20px">
        <TitleWithTag
          title="Event Tickets"
          desc="These are tickets for this event"
          tags={[
            { type: 'pass', pass: 'zupass' },
            { type: 'warning', text: 'Required to open event' },
          ]}
        />
        <ConfigPanel
          title="Configure ZuPass"
          desc="Setup ZuPass credential to link to this event"
          handleOpen={handleOpen}
        />
        <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
          <Form onClose={handleClose} />
        </Drawer>
      </Stack>
      <RegistrationStatus />
      <AccessRules />
      <ApplicationPanel />
    </>
  );
}
