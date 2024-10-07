import { Link, Stack, Typography } from '@mui/material';
import { ConfigPanel, TitleWithTag } from '../Common';
import { RegistrationStatus } from '../Status';
import ApplicationPanel from '../Application/Panel';
import AccessRules from '../AccessRules';
import useOpenDraw from '@/hooks/useOpenDraw';
import Drawer from '@/components/drawer';
import Form from './Form';
import { TicketIcon } from '@/components/icons/Ticket';
import { RegistrationAndAccess } from '@/types';
import { useMemo } from 'react';
import { TagProps } from '../types';

interface ZupassListProps {
  regAndAccess?: RegistrationAndAccess;
}

export default function ZupassList({ regAndAccess }: ZupassListProps) {
  const { open, handleOpen, handleClose } = useOpenDraw();
  const isConfigured = !!regAndAccess?.zuPassInfo;

  const tags = useMemo(() => {
    const tags: TagProps[] = [{ type: 'pass', pass: 'zupass' }];
    if (!isConfigured) {
      tags.push({
        type: 'warning',
        text: 'Required to open event',
      });
    }
    return tags;
  }, [isConfigured]);

  return (
    <>
      <Stack spacing="20px">
        <TitleWithTag
          title="Event Ticketing"
          desc="These are tickets for this event"
          tags={tags}
          buttonText={isConfigured ? 'Configure' : undefined}
          required={!isConfigured}
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
          <Form onClose={handleClose} regAndAccess={regAndAccess} />
        </Drawer>
      </Stack>
      <RegistrationStatus />
      <AccessRules />
      <ApplicationPanel regAndAccess={regAndAccess} />
    </>
  );
}
