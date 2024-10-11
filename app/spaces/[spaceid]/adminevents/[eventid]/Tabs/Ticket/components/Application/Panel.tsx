import { Box, Stack } from '@mui/material';
import { TitleWithTag } from '../Common';
import { ZuButton } from '@/components/core';
import { PlusIcon } from '@/components/icons';
import useOpenDraw from '@/hooks/useOpenDraw';
import Drawer from '@/components/drawer';
import Form from './Form';
import Submissions from './Submissions';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, RegistrationAndAccess } from '@/types';
import { useMemo } from 'react';
import { TagProps, TicketingMethod } from '../types';

interface PanelProps {
  regAndAccess?: RegistrationAndAccess;
}

export default function Panel({ regAndAccess }: PanelProps) {
  const { open, handleOpen, handleClose } = useOpenDraw();
  const pathname = useParams();
  const { composeClient } = useCeramicContext();

  const eventId = pathname.eventid.toString();

  const { data: applicationForms } = useQuery({
    queryKey: ['fetchApplicationForms', eventId],
    queryFn: () => {
      const query = `
      query FetchEvent($id: ID!) {
        node(id: $id) {
          ...on ZucityEvent {
            applicationForms(first:1000) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    `;
      return composeClient.executeQuery<{ node: Event }>(query, {
        id: eventId,
      });
    },
    enabled: !!eventId,
  });

  const data = applicationForms?.data?.node?.applicationForms?.edges;
  const hasConfiged = !!regAndAccess?.applicationForm;
  const hasAnswers = data?.length && data.length > 0;
  const questions = hasConfiged
    ? regAndAccess!.applicationForm!.split(',')
    : [''];

  const tags = useMemo(() => {
    const tags: TagProps[] = [
      {
        type: 'text',
        text: `Setting: ${regAndAccess?.applyRule}${
          regAndAccess?.applyOption ? `- ${regAndAccess?.applyOption}` : ''
        }`,
      },
    ];
    if (!hasConfiged) {
      tags.push({
        type: 'warning',
        text: 'Required to open event',
      });
    }
    return tags;
  }, [hasConfiged, regAndAccess?.applyOption, regAndAccess?.applyRule]);

  return (
    <Stack>
      <TitleWithTag
        tags={tags}
        title="Event Applications"
        desc="Add a series of questions for users to answer when they apply for your event"
        buttonText={hasConfiged ? 'Configure Questions' : undefined}
        required={!hasConfiged}
        onClick={handleOpen}
      />
      <Box>
        {hasConfiged ? (
          <Submissions list={Array.from({ length: 10 })} />
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
        <Form
          questions={questions}
          onClose={handleClose}
          regAndAccess={regAndAccess}
        />
      </Drawer>
    </Stack>
  );
}
