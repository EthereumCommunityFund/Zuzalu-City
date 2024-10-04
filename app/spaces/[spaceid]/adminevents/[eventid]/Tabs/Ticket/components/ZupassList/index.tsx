import { Link, Stack, Typography } from '@mui/material';
import { ConfigPanel, TitleWithTag } from '../Common';
import { RegistrationStatus } from '../Status';
import ApplicationPanel from '../Application/Panel';
import AccessRules from '../AccessRules';
import useOpenDraw from '@/hooks/useOpenDraw';
import Drawer from '@/components/drawer';
import Form from './Form';
import { TicketIcon } from '@/components/icons/Ticket';

export default function ZupassList() {
  const { open, handleOpen, handleClose } = useOpenDraw();
  const isConfigured = true;
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
          buttonText={isConfigured ? 'Configure' : undefined}
          onClick={handleOpen}
        />
        {!isConfigured ? (
          <ConfigPanel
            title="Configure ZuPass"
            desc="Setup ZuPass credential to link to this event"
            handleOpen={handleOpen}
          />
        ) : (
          <ConfigPanel
            title="Tickets are managed on ZuPass"
            desc={
              <Typography>
                This event is using{' '}
                <Link href="https://zupass.org" target="_blank">
                  ZuPass
                </Link>
              </Typography>
            }
            icon={<TicketIcon size={7.5} color="rgba(255, 255, 255, 0.5)" />}
            needButton={false}
          />
        )}
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
