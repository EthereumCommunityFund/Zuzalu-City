import { Stack } from '@mui/material';
import { ConfigPanel, TitleWithTag } from '../Common';
import { RegistrationStatus } from '../Status';
import ApplicationPanel from '../Application/Panel';
import AccessRules from '../AccessRules';

export default function ZupassList() {
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
          handleOpen={() => {}}
        />
      </Stack>
      <RegistrationStatus />
      <AccessRules />
      <ApplicationPanel />
    </>
  );
}
