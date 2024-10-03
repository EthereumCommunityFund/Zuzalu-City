import { Stack } from '@mui/material';
import { TitleWithTag } from '../Common';
import { ZuButton } from '@/components/core';
import { PlusIcon } from '@/components/icons';
import useOpenDraw from '@/hooks/useOpenDraw';
import Drawer from '@/components/drawer';
import Form from './Form';

export default function Panel() {
  const { open, handleOpen, handleClose } = useOpenDraw();
  return (
    <Stack>
      <TitleWithTag
        tags={[
          {
            type: 'text',
            text: 'Setting: Approval-Based',
          },
          {
            type: 'warning',
            text: 'Required to open event',
          },
        ]}
        title="Event Applications"
        desc="Add a series of questions for users to answer when they apply for your event"
      />
      <ZuButton
        startIcon={<PlusIcon size={4} />}
        sx={{ mt: '20px', width: '100%', p: '10px', fontWeight: 600 }}
        onClick={handleOpen}
      >
        Create Registration Form
      </ZuButton>
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        <Form onClose={handleClose} />
      </Drawer>
    </Stack>
  );
}
