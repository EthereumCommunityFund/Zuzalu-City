import * as React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import {
  InformationIcon,
  ListIcon,
  PlusIcon,
  TableIcon,
  PlusCircleIcon
} from 'components/icons';
import { ZuButton } from 'components/core';
import SessionCard from './SessionCard';

import { Session, SessionData } from '@/types';

type SessionsListProps = {
  sessions?: Session[];
};

const SessionList: React.FC<SessionsListProps> = ({ sessions = [] }) => {
  return (
    <Stack direction={'column'} spacing="20px">
      <Stack spacing="10px">
        <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
          <Typography variant="h6">Session List</Typography>
          <InformationIcon />
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Sessions makeup the schedule of an event
        </Typography>
      </Stack>
      {
        sessions.length > 0 ? <Stack spacing={2} divider={<Divider sx={{ borderColor: '#383838' }} />}>
          {sessions.map((session, index) => (
            <SessionCard
              key={`SessionCard-${index}`}
              session={session}
            />
          ))}
        </Stack> :
          <Stack
            direction="column"
            alignItems="center"
            bgcolor="#2d2d2d"
            padding="20px 10px"
            borderRadius={2}
          >
            <PlusCircleIcon color="#6c6c6c" size={15} />
            <Typography variant="subtitle2">No Sessions</Typography>
            <Typography variant="body2" sx={{ opacity: 0.5 }}>Create a Session</Typography>
          </Stack>
      }
    </Stack>
  );
};

export default SessionList;
