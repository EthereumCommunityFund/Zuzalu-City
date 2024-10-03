import { Box, Stack } from '@mui/material';
import { TitleWithTag } from '../Common';
import { ZuButton } from '@/components/core';
import { PlusIcon } from '@/components/icons';
import useOpenDraw from '@/hooks/useOpenDraw';
import Drawer from '@/components/drawer';
import Form from './Form';
import Submissions from './Submissions';

export default function Panel() {
  const { open, handleOpen, handleClose } = useOpenDraw();

  const hasQuestions = true;
  const questions = hasQuestions ? ['Q1', 'Q2', 'Q3'] : [''];

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
        buttonText={hasQuestions ? 'Configure Questions' : undefined}
        onClick={handleOpen}
      />
      <Box mt="20px">
        {hasQuestions ? (
          <Submissions />
        ) : (
          <ZuButton
            startIcon={<PlusIcon size={4} />}
            sx={{ mt: '20px', width: '100%', p: '10px', fontWeight: 600 }}
            onClick={handleOpen}
          >
            Create Registration Form
          </ZuButton>
        )}
      </Box>
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        <Form questions={questions} onClose={handleClose} />
      </Drawer>
    </Stack>
  );
}
