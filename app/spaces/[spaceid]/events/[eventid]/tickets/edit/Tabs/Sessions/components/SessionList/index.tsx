import * as React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import {
  InformationIcon,
  ListIcon,
  PlusIcon,
  TableIcon,
} from 'components/icons';
import { ZuButton } from 'components/core';
import SessionCard from './SessionCard';

const SessionList = () => {
  return (
    <Stack direction={'column'} spacing={2}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
          <Typography variant="h6">Session List</Typography>
          <InformationIcon />
        </Stack>
        <Stack direction={'row'} spacing={2} alignItems={'center'}>
          <Stack
            direction={'row'}
            bgcolor={'#2a2a2a'}
            padding={'4px'}
            borderRadius={'10px'}
            spacing={1}
            alignItems={'center'}
          >
            <Stack bgcolor={'#404040'} padding={'2px'} borderRadius={'5px'}>
              <ListIcon />
            </Stack>
            <Stack>
              <TableIcon />
            </Stack>
          </Stack>
          <ZuButton startIcon={<PlusIcon />}>Add a Session</ZuButton>
        </Stack>
      </Stack>
      <Typography
        align="center"
        paddingY={1.5}
        variant="subtitleS"
        bgcolor={'#2b2b2b'}
        borderRadius={2}
      >
        Monday, October 2023
      </Typography>
      <Stack spacing={2} divider={<Divider sx={{ borderColor: '#383838' }} />}>
        <SessionCard />
        <SessionCard />
        <SessionCard />
      </Stack>
      <Typography variant="body2" color="white" fontStyle="italic">
        Prototype Note: Below shows an empty state
      </Typography>
    </Stack>
  );
};

export default SessionList;
