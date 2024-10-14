import { Link, Stack, Typography } from '@mui/material';
import Drawer from '@/components/drawer';
import useOpenDraw from '@/hooks/useOpenDraw';
import { RegistrationStatus } from '../Status';
import { ConfigPanel, TitleWithTag } from '../Common';
import { RegistrationAndAccess } from '@/types';
import useRegAndAccess from '@/hooks/useRegAndAccess';
import { useMemo } from 'react';
import { TagProps } from '../types';
import { TicketIcon } from '@/components/icons';
import Form from './Form';

interface PGFListProps {
  regAndAccess?: RegistrationAndAccess;
}

export default function PGFList({ regAndAccess }: PGFListProps) {
  const { open, handleOpen, handleClose } = useOpenDraw();

  const { registrationAvailable } = useRegAndAccess({
    regAndAccess,
  });

  const isConfigured = !!regAndAccess?.zuLottoInfo;

  const tags = useMemo(() => {
    const tags: TagProps[] = [{ type: 'pass', pass: 'lotto' }];
    return tags;
  }, []);

  return (
    <>
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        <Form onClose={handleClose} regAndAccess={regAndAccess} />
      </Drawer>
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
            title="Configure LottoPGF"
            desc="Enter LottoPGF credentials to link to this event"
            handleOpen={handleOpen}
          />
        ) : (
          <ConfigPanel
            title="Tickets are now managed on LottoPGF"
            desc={
              <Typography>
                This event is using{' '}
                <Link href="https://lottopgf.org/" target="_blank">
                  ZuLotto
                </Link>
              </Typography>
            }
            icon={<TicketIcon size={7.5} color="rgba(255, 255, 255, 0.5)" />}
            needButton={false}
          />
        )}
      </Stack>
      <RegistrationStatus
        regAndAccess={regAndAccess}
        isAvailable={registrationAvailable}
      />
    </>
  );
}
